'use client';

import ResourceAdmin from '@/components/ResourceAdmin';
import { resourceConfigs } from '@/lib/resourceConfigs';

export default function Page() {
  return <ResourceAdmin config={resourceConfigs['facilities']} />;
}
