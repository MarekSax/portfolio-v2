import chalk from 'chalk';
import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { z } from 'zod';

// --- env validation ---
const envSchema = z.object({
  CONTENTFUL_SPACE_ID: z.preprocess((value) => (!value ? '' : value), z.string().min(1, 'missing')),
  CONTENTFUL_ACCESS_TOKEN: z.preprocess((value) => (!value ? '' : value), z.string().min(1, 'missing')),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(chalk.red.bold('\n❌ Environment configuration error:\n'));
  for (const issue of parsed.error.issues) {
    console.error(chalk.yellow(`   - ${issue.path.join('.')}:`) + ` ${chalk.red(issue.message)}`);
  }
  console.error(chalk.cyan('\nPlease set the missing variables in your `.env` file or system environment.\n'));

  process.exit(1);
}

export const env = parsed.data;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
    ],
  },
  env: {
    CONTENTFUL_SPACE_ID: env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_ACCESS_TOKEN: env.CONTENTFUL_ACCESS_TOKEN,
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
