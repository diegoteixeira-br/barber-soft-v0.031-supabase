
# Plano: Correção da Busca de Clientes na API

## Diagnóstico do Problema

### O que está acontecendo

O cliente **Diego Teixeira** existe no banco com o telefone `5565999891722` (13 dígitos), mas a API está buscando por `556599891722` (12 dígitos) - falta o nono dígito!

| Origem | Telefone | Comprimento |
|--------|----------|-------------|
| WhatsApp (enviado) | `556599891722` | 12 dígitos |
| Banco de dados | `5565999891722` | 13 dígitos |

A diferença está no **nono dígito** (`9` extra no celular):
- Enviado: `55` + `65` + `99891722` = 12 dígitos (8 dígitos locais)
- Salvo: `55` + `65` + `999891722` = 13 dígitos (9 dígitos locais)

### Por que isso acontece

O WhatsApp Evolution API retorna o número no formato internacional, mas alguns números de celular antigos podem estar sem o nono dígito de prefixo. 

No Brasil:
- Celulares com DDD têm **9 dígitos locais** (começando com 9)
- Fixos têm **8 dígitos locais**

O problema é que a busca atual faz uma comparação **exata** (`eq('phone', clientPhone)`), então se os formatos forem diferentes, não encontra.

### Situação atual no banco
- **47 clientes** com 13 dígitos (formato correto com nono dígito)
- **3 clientes** com 12 dígitos (sem nono dígito - formato antigo ou incorreto)

## Solução Proposta

### Parte 1: Busca Flexível na Edge Function

Modificar a função `handleCheckClient` para fazer uma busca mais inteligente:

1. **Normalizar o telefone de busca** para garantir formato consistente
2. **Buscar com variações** quando a busca exata falhar:
   - Se o número tem 12 dígitos (faltando 9º dígito), também buscar adicionando o "9" após o DDD
   - Se o número tem 13 dígitos, também buscar removendo o "9" após o DDD

```typescript
async function handleCheckClient(supabase, body, corsHeaders) {
  const rawPhone = body.telefone || body.client_phone;
  const clientPhone = rawPhone?.replace(/\D/g, '') || null;
  const { unit_id } = body;

  // ... validações ...

  // BUSCA EXATA primeiro
  let { data: client } = await supabase
    .from('clients')
    .select(...)
    .eq('unit_id', unit_id)
    .eq('phone', clientPhone)
    .maybeSingle();

  // Se não encontrou, tentar variações
  if (!client) {
    const variations = getPhoneVariations(clientPhone);
    
    for (const variation of variations) {
      const { data: foundClient } = await supabase
        .from('clients')
        .select(...)
        .eq('unit_id', unit_id)
        .eq('phone', variation)
        .maybeSingle();
      
      if (foundClient) {
        client = foundClient;
        break;
      }
    }
  }
  
  // ... resto da lógica ...
}

function getPhoneVariations(phone) {
  const variations = [];
  
  // Se tem 12 dígitos (55 + DDD + 8 dígitos), adicionar o 9
  // Ex: 556599891722 -> 5565999891722
  if (phone.length === 12 && phone.startsWith('55')) {
    const ddd = phone.substring(2, 4);
    const localNumber = phone.substring(4);
    variations.push(`55${ddd}9${localNumber}`);
  }
  
  // Se tem 13 dígitos com 9 extra, remover o 9
  // Ex: 5565999891722 -> 556599891722
  if (phone.length === 13 && phone.startsWith('55')) {
    const ddd = phone.substring(2, 4);
    const localWithNine = phone.substring(4);
    if (localWithNine.startsWith('9')) {
      variations.push(`55${ddd}${localWithNine.substring(1)}`);
    }
  }
  
  return variations;
}
```

### Parte 2: Normalização dos Dados Existentes (Migration)

Corrigir os 3 clientes que estão com 12 dígitos adicionando o nono dígito:

```sql
-- Adiciona o 9º dígito para celulares que estão com apenas 8 dígitos locais
UPDATE public.clients
SET 
  phone = SUBSTR(phone, 1, 4) || '9' || SUBSTR(phone, 5),
  updated_at = NOW()
WHERE phone IS NOT NULL
  AND LENGTH(phone) = 12
  AND phone LIKE '55%'
  -- Garantir que é celular (começa com 9 após o DDD)
  AND SUBSTR(phone, 5, 1) = '9';
```

### Parte 3: Aplicar Mesma Lógica no `handleRegisterClient`

Para evitar futuros problemas, normalizar o telefone ao cadastrar novos clientes.

## Resumo das Alterações

| Arquivo | Alteração |
|---------|-----------|
| `supabase/functions/agenda-api/index.ts` | Adicionar função `getPhoneVariations` e atualizar `handleCheckClient` para buscar com variações |
| Nova migration SQL | Normalizar telefones existentes com 12 dígitos |

## Fluxo Após a Correção

```text
WhatsApp envia: 556599891722
         ↓
     Busca exata
         ↓
   Não encontrado
         ↓
  Tenta variação: 5565999891722
         ↓
   ✅ ENCONTRADO!
```

---

## Seção Técnica

### Lógica de Variação de Telefone

A função `getPhoneVariations` cria variações inteligentes:

| Input (12 dígitos) | Variação (13 dígitos) |
|--------------------|----------------------|
| `556599891722` | `5565999891722` |
| `552195265119` | `5521995265119` |

| Input (13 dígitos) | Variação (12 dígitos) |
|--------------------|----------------------|
| `5565999891722` | `556599891722` |

### Por que não usar LIKE na busca?

- **Performance**: `LIKE` com wildcard no início (`%phone`) não usa índice
- **Precisão**: Poderia retornar falsos positivos

### Por que buscar variações sequencialmente?

- A maioria das buscas vai encontrar na primeira tentativa (busca exata)
- Apenas casos edge (números antigos) precisam das variações
- Mínimo impacto na performance
