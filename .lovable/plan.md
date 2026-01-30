
# Plano: Programa de Fidelidade Simplificado

## Resumo do Que Voce Quer

Voce quer um programa de fidelidade simples:
- **5 cortes pagos** (com valor >= minimo estipulado) = **6o corte gratis**
- A cortesia **nao acumula** - se o cliente ja tem 1 cortesia, para de contar ate ele usar
- **Pop-up no 6o corte** avisando que e cortesia, para o barbeiro selecionar "Cortesia de Fidelidade" como pagamento

## Situacao Atual vs Desejada

| Aspecto | Atual | Desejado |
|---------|-------|----------|
| Contagem com cortesia pendente | Continua contando | **Pausa ate usar** |
| Quando mostra pop-up | Depois de finalizar (apos trigger) | **No 6o corte, ANTES de finalizar** |
| Cortesias acumulativas | Sim (pode ter 2, 3...) | **Nao (maximo 1)** |
| Quando zerar contador | Ao atingir threshold | **Ao atingir threshold** |

## Mudancas Necessarias

### 1. Modificar Trigger do Banco de Dados

Adicionar condicao para **pausar contagem** quando cliente ja tem cortesia disponivel:

```sql
-- Adicionar na validacao should_count_loyalty:
AND COALESCE(client_record.available_courtesies, 0) = 0  -- Pausa se ja tem cortesia
```

### 2. Modificar o Fluxo de Finalizacao no Frontend

Antes de abrir o modal de pagamento, verificar:
- Quantos cortes o cliente tem? (`loyalty_cuts`)
- Qual o threshold? (ex: 5)
- Se `loyalty_cuts + 1 >= threshold` E valor >= minimo E nao e cortesia pendente

Se sim, mostrar pop-up especial: **"Este e o 6o corte! Cortesia de Fidelidade!"**

### 3. Arquivos a Modificar

| Arquivo | Mudanca |
|---------|---------|
| `sync_client_on_appointment_complete` (trigger SQL) | Adicionar bloqueio quando `available_courtesies > 0` |
| `AppointmentDetailsModal.tsx` | Detectar 6o corte ANTES de finalizar e mostrar pop-up |
| `useFidelityCourtesy.ts` | Adicionar funcao para checar se e o 6o corte |
| `PaymentMethodModal.tsx` | Mostrar destaque quando e o corte gratis |

## Fluxo Detalhado

```text
Cliente faz 5o corte (pago)
      |
      v
Trigger incrementa loyalty_cuts para 5
      |
      v
Cliente volta para 6o corte
      |
      v
Barbeiro clica "Finalizar"
      |
      v
Sistema detecta: loyalty_cuts=5, threshold=5
      |
      v
Pop-up especial: "Este e o 6o corte! Cortesia de Fidelidade!"
      |
      v
Barbeiro confirma com "Cortesia de Fidelidade"
      |
      v
Trigger: zera loyalty_cuts, NAO incrementa available_courtesies
         (porque ja esta usando a cortesia)
```

## Detalhes Tecnicos

### Trigger SQL Modificado

A funcao `sync_client_on_appointment_complete` sera atualizada para:

1. **Bloquear contagem** quando `available_courtesies > 0`
2. Quando o cliente usa cortesia de fidelidade (`payment_method = 'fidelity_courtesy'`):
   - Zerar `loyalty_cuts`
   - Decrementar `available_courtesies`

### Frontend - AppointmentDetailsModal.tsx

Nova logica antes de abrir modal de pagamento:

1. Buscar `loyalty_cuts` atual do cliente
2. Buscar `fidelity_cuts_threshold` das configuracoes
3. Buscar valor do servico e `fidelity_min_value`
4. Se `loyalty_cuts + 1 >= threshold` E `valor >= min_value`:
   - Abrir modal com **destaque para cortesia de fidelidade**
   - Mensagem: "Este e o Xo corte! Cortesia de Fidelidade!"

### useFidelityCourtesy.ts

Nova funcao `checkIfNextCutIsFree`:

```typescript
checkIfNextCutIsFree(clientPhone, unitId, serviceValue) => {
  // Retorna true se o proximo corte (este) e o gratis
}
```

### PaymentMethodModal.tsx

Quando for o corte gratis:
- Mostrar botao "Cortesia de Fidelidade" em destaque no topo
- Ocultar ou diminuir outros metodos de pagamento
- Mensagem clara: "5o corte pago! Este e GRATIS!"
