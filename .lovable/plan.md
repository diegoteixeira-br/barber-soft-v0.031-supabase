
# Plano: Corrigir Preview de Imagem no WhatsApp

## Diagnóstico

O Facebook Debugger mostra a imagem corretamente, mas o WhatsApp não. Isso pode acontecer por:

1. **Cache agressivo do WhatsApp** - O WhatsApp guarda previews por muito tempo
2. **Meta tags incompletas** - Faltam algumas tags que o WhatsApp pode esperar
3. **Tamanho do arquivo** - A imagem pode estar muito pesada

## Solução

### 1. Adicionar Meta Tags Extras no index.html

Vou adicionar tags adicionais que podem ajudar o WhatsApp:

```html
<!-- Adicionar após as tags existentes -->
<meta property="og:image:type" content="image/png" />
<meta property="og:image:secure_url" content="https://barbersoft.com.br/og-image.png" />
<meta property="og:image:alt" content="BarberSoft - Sistema de Gestão para Barbearias com Dashboard e Chat Jackson" />
```

### 2. Forçar Cache Reset

Para forçar o WhatsApp a buscar novamente, as opções são:

- **Opção A**: Renomear a imagem para `og-image-v2.png` e atualizar as meta tags (força o WhatsApp a tratar como novo link)
- **Opção B**: Aguardar algumas horas para o cache expirar naturalmente

**Recomendo a Opção A** (renomear) pois é mais rápida.

### Arquivos a Modificar

1. `index.html` - Adicionar meta tags extras e atualizar URL da imagem
2. `public/og-image.png` - Renomear para `public/og-image-v2.png`
3. `src/components/seo/SEOHead.tsx` - Atualizar referência da imagem padrão

## Resultado Esperado

Após publicar e enviar o link em um **chat novo** do WhatsApp, a imagem deve aparecer corretamente como no ComunicaZap.
