# WhatsApp TLTR Bot

![WhatsApp TLTR Bot Logo](https://github.com/maletta/whatsapp-tltr-bot/blob/main/assets/commands.png)

The WhatsApp TLTR Bot is an Express application that leverages the whatsapp-web.js library to create a bot capable of summarizing lengthy WhatsApp conversations, making them easier and quicker to read.

## Features

- Analyzes group conversations on WhatsApp.
- Generates a summary of the main discussions and topics covered.
- Customizable and extensible to meet the specific needs of the group.

## Getting Started

1. Clone this repository:

git clone https://github.com/maletta/whatsapp-tltr-bot.git

2. Install the dependencies:

npm install

## Available Commands

- .summarize: Summarizes the chat conversations using a generative AI. Accepts the following arguments to set the time limit:
  - 1 for 1 hour
  - 2 for 2 hours
  - 4 for 4 hours
  - 6 for 6 hours
  - 30 for 30 minutes
- .sticker: Transforms a tagged or mentioned image into a sticker.
- .all: Mentions all participants of the group in the message.

