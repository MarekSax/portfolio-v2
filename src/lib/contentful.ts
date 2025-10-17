// src/lib/contentful.ts
import { createClient } from 'contentful';

import type { LOCALE_CODE } from '@/types/contentful';

// import { env } from '../../next.config';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  githubUrl?: string;
  demoUrl: string;
  thumbnail: string;
};

type AssetLike = {
  fields?: {
    file?: {
      url?: string;
    };
  };
};

export async function getProjects(locale: LOCALE_CODE): Promise<Project[]> {
  const entries = await client.getEntries({
    content_type: 'project',
    order: ['-sys.createdAt'],
    locale,
  });

  return entries.items.map((item) => ({
    id: item.sys.id,
    title: item.fields.title as string,
    slug: item.fields.slug as string,
    description: item.fields.description as string,
    githubUrl: item.fields.githubUrl as string | undefined,
    demoUrl: item.fields.demoUrl as string,
    thumbnail: (() => {
      const url = (item.fields.thumbnail as unknown as AssetLike)?.fields?.file?.url;
      if (!url) return '/next.svg';
      return url.startsWith('http') ? url : `https:${url}`;
    })(),
  }));
}
