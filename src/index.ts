import discord from 'discord.js';
import discordConfig from './config/discord.config';
import Character from './lib/character.class';
import { mainChannelId, mainGuildId, openaiApiKey } from './lib/config';
const client = new discord.Client({
  intents: [
    'Guilds',
    'GuildMessages',
    'GuildMessageReactions',
    'GuildMessageTyping',
    'DirectMessages',
    'DirectMessageReactions',
    'DirectMessageTyping',
    'MessageContent',
  ],
});

const getGuilds = () => {
  return client.guilds.cache;
};
let character: Character | null = null;
client.on('ready', async () => {
  console.log('Ready!');
});

type ChatMessage = {
  user: string;
  message: string;
  time: Date;
};

client.login(discordConfig.CLIENT_SECRET);

client.on('messageCreate', async (message) => {
  if (message.author.id === client.user?.id) {
    return;
  }
  if (message.channelId !== mainChannelId) {
    return;
  }
  if (!character) {
    if (message.content.startsWith('!character ')) {
      const content = message.content.replace('!character ', '');
      character = new Character({
        name: content,
        openaiApiKey: openaiApiKey,
      });
      await character.init();
      // set nickname in the guild to the character name
    } else {
      message.reply('You need to set a character first, use !character <name>');
    }
    return;
  }
  if (!character?.ready()) {
    await character.waitForReady();
  }
  let response = await character.respondToChat({
    message: message.content,
    username: message.author.username,
    userid: message.author.id,
    channel: message.channel as discord.TextChannel,
  });
  message.reply(response);
});
