import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

export const openaiApiKey = z.string().parse(process.env.OPENAI_API_KEY);

export const mainChannelId = z.string().parse(process.env.MAIN_CHANNEL_ID);

export const mainGuildId = z.string().parse(process.env.MAIN_GUILD_ID);
