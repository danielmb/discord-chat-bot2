import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getGuild = async (guildId: string) => {
  await prisma.$connect();
  const result = await prisma.guild.findFirst({
    where: {
      guildId,
    },
  });
  return result;
};

export const getGuilds = async () => {
  await prisma.$connect();
  const result = await prisma.guild.findMany();
  return result;
};

export const createGuild = async (guildId: string, name: string) => {
  await prisma.$connect();
  const result = await prisma.guild.create({
    data: {
      guildId,
      name: name,
    },
  });
  return result;
};

export const getSetting = async (guildId: string, setting: string) => {
  await prisma.$connect();
  const result = await prisma.setting.findFirst({
    where: {
      guildId,
      key: setting,
    },
  });
  return result?.value;
};
