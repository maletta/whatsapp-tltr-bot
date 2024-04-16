# WhatsApp TLTR Bot

![WhatsApp TLTR Bot Logo](https://github.com/maletta/whatsapp-tltr-bot/blob/main/assets/commands.png)

The WhatsApp TLTR Bot is an Express application that leverages the whatsapp-web.js library to create a bot capable of summarizing lengthy WhatsApp conversations, making them easier and quicker to read.

## Features

- Analyzes group conversations on WhatsApp.
- Generates a summary of the main discussions and topics covered.
- Customizable and extensible to meet the specific needs of the group.
- Transform image into stickers.
- Send Jokes and Fun Facts.

## Getting Started

1. Clone this repository:

```bash
git clone https://github.com/maletta/whatsapp-tltr-bot.git
```

2. Install the dependencies:

```bash
npm install
```


## Available Commands

- .resuma: Summarizes the chat conversations using a generative AI. Accepts the following arguments to set the time limit:
  - 1 for 1 hour
  - 2 for 2 hours
  - 4 for 4 hours
  - 6 for 6 hours
  - 30 for 30 minutes
- .aleatorio: sends fun facts and jokes.
- .cancelado | .cancelada: sends a critical message as if it were a virtual cancellation
- .todos: Mentions all participants of the group in the message.
- .sticker: Transforms a tagged or mentioned image or video into a sticker.

