'use client';

import { useMemo } from 'react';

import { createDefaultStudioHost } from '@/components/studio/backend';
import { LocalStudioApp } from '@/components/studio/local-studio-app';
import type { StudioBootContext } from '@/components/studio/studio-boot';

type StudioEntryProps = {
  bootContext: StudioBootContext;
};

export function StudioEntry({ bootContext }: StudioEntryProps) {
  const host = useMemo(() => createDefaultStudioHost(), []);

  return <LocalStudioApp bootContext={bootContext} host={host} />;
}
