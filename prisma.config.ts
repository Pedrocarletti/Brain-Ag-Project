import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

config({ path: process.env.DOTENV_CONFIG_PATH ?? '.env' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
});
