# WhatsApp TLTR Bot

![WhatsApp TLTR Bot Logo](https://github.com/seu-usuario/whatsapp-tltr-bot.git/assets/commands.png)

O WhatsApp TLTR Bot é um aplicativo Express que utiliza a biblioteca whatsapp-web.js para criar um bot capaz de resumir conversas longas do WhatsApp, tornando-as mais fáceis e rápidas de ler.

## Funcionalidades

- Analisa conversas de grupos do WhatsApp.
- Gera um resumo das principais discussões e tópicos abordados.
- Personalizável e extensível para atender às necessidades específicas do grupo.

## Como Usar

1. Clone este repositório:

```bash
git clone https://github.com/seu-usuario/whatsapp-tltr-bot.git
```

2. Comandos disponíveis
- `.resuma`: Resume as conversas do chat com alguma IA generativa.
Aceita os seguintes argumentos para definir o limite de horas
  - `1` para 1 hora
  - `2` para 2 horas
  - `4` para 4 horas
  - `6` para 6 horas
  - `30` para 30 minutos
- `.sticker`: Transforme uma imagem marcada ou menciona em sticker.
- `.todos`: Menciona todos os participantes do grupo na mensagem 

