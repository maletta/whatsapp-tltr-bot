import WwebjsSender from '@deathabyss/wwebjs-sender';
import { Client, Message } from 'whatsapp-web.js';

export async function createEmbed(client: Client, message: Message) {
  const { from } = message;

  console.log('Embed criado com sucesso!'); // Adicione uma mensagem mais descritiva

  const embed = new WwebjsSender.MessageEmbed()
    .sizeEmbed(28)
    .setTitle('✅ | Processo bem-sucedido!')
    .setDescription('O processo foi concluído com sucesso!')
    .addField('✔', 'Para confirmar')
    .addField('❌', 'Para cancelar')
    .addFields({
      name: 'Agora você tem 2 botões para escolher!',
      value: '✔ ou ❌',
    })
    .setFooter('WwebjsSender')
    .setTimestamp();

  const button1 = new WwebjsSender.MessageButton()
    .setCustomId('confirm')
    .setLabel('✔');

  const button2 = new WwebjsSender.MessageButton()
    .setCustomId('cancel')
    .setLabel('❌');

  const senderInstance = new WwebjsSender(); // Crie uma instância de WwebjsSender
  senderInstance.send({
    client,
    number: from,
    embed,
    button: [button1, button2],
  });
}
