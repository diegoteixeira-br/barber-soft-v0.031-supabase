

# Plano: Adicionar Barra de Rolagem ao Modal de Atendimento Rapido

## Problema Identificado

O modal "Atendimento Rapido" (`QuickServiceModal`) nao possui barra de rolagem. Em computadores com telas menores, os botoes "Cancelar" e "Lancar Atendimento" ficam cortados e inacessiveis.

## Solucao

Adicionar o componente `ScrollArea` do Radix UI ao redor do formulario para permitir rolagem vertical quando o conteudo exceder a altura disponivel da tela.

## Mudancas Tecnicas

### Arquivo: `src/components/agenda/QuickServiceModal.tsx`

1. **Importar ScrollArea**
   - Adicionar import do componente `ScrollArea` de `@/components/ui/scroll-area`

2. **Envolver o formulario com ScrollArea**
   - Adicionar `ScrollArea` com altura maxima responsiva (`max-h-[70vh]`)
   - Manter os botoes fixos fora do scroll para sempre estarem visiveis

3. **Estrutura proposta**

```text
DialogContent
  └── DialogHeader (fixo no topo)
  └── ScrollArea (max-h-[70vh])
       └── Form fields (rolaveis)
  └── Botoes (fixos no rodape)
```

## Codigo da Mudanca

```typescript
// Adicionar import
import { ScrollArea } from "@/components/ui/scroll-area";

// Estrutura do DialogContent
<DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
  <DialogHeader>...</DialogHeader>
  
  <ScrollArea className="flex-1 pr-4">
    <Form>
      <form className="space-y-4">
        {/* Todos os campos do formulario */}
      </form>
    </Form>
  </ScrollArea>
  
  {/* Botoes fora do scroll - sempre visiveis */}
  <div className="flex justify-end gap-2 pt-4 border-t">
    <Button variant="outline">Cancelar</Button>
    <Button type="submit">Lancar Atendimento</Button>
  </div>
</DialogContent>
```

## Beneficios

- Usuarios com telas menores conseguirao ver e acessar todos os botoes
- O scroll fica discreto e so aparece quando necessario
- Os botoes de acao permanecem sempre visiveis na parte inferior
- Compativel com dispositivos moveis

