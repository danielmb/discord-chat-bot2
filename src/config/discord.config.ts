import { z } from 'zod';

import dotenv from 'dotenv';

dotenv.config();

const discordConfig = z
  .object({
    CLIENT_SECRET: z.string(),
  })
  .parse(process.env);

export default discordConfig;
