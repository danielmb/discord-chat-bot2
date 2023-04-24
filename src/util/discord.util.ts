import discord from 'discord.js';
const findTextChannel = (
  guild: discord.Guild,
  channelName: string | RegExp,
) => {
  return guild.channels.cache.find((channel) => {
    if (channel.type === discord.ChannelType.GuildText) {
      if (typeof channelName === 'string') {
        return channel.name === channelName;
      } else {
        return channelName.test(channel.name);
      }
    }
    return false;
  });
};
