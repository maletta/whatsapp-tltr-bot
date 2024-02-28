import axios from 'axios';

// Função para enviar uma requisição para a API do ChatGPT

const generatePrompt = (messages: string) =>
  `faça o resumo por tópicos dos principais conteúdos abordardos nesse conjunto de mensagens de um grupo do whatsapp: ${messages}`;

async function askChatGPT(text: string): Promise<string> {
  const prompt = generatePrompt(text);
  try {
    const response = await axios.post(
      // 'https://api.openai.com/v1/completions',
      // 'https://api.openai.com/v1/chat/completions',
      'https://api.openai.com/v1/completions',
      {
        // model: 'gpt-3.5-turbo-instruct',
        model: 'text-davinci-003',
        messages: [
          {
            role: 'user',
            content: 'o que é azul',
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CHAT_KEY}`,
        },
      },
    );

    // Retorna a resposta do ChatGPT
    return response.data.choices[0].message.content;
  } catch (error) {
    if (error.response.data) {
      console.error(
        'Erro ao enviar requisição para a API do ChatGPT:',
        error.response.data,
      );
    }
    // console.error('Erro ao enviar requisição para a API do ChatGPT:', error);
    return null;
  }
}

async function sendPromptToOpenAI(text: string) {
  const prompt = generatePrompt(text);

  const data = {
    model: 'text-davinci-002',
    prompt,
    max_tokens: 60,
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CHAT_KEY}`,
    },
  };

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      data,
      config,
    );
    return response.data.choices[0].text;
  } catch (error) {
    console.error('Erro ao enviar requisição para a API da OpenAI:', error);
    return null;
  }
}

export { askChatGPT, sendPromptToOpenAI };
