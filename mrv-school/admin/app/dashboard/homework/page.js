'use client';

import ResourceAdmin from '@/components/ResourceAdmin';
import { academicResourceConfigs } from '@/lib/resourceConfigs';

export default function Page() {
  return <ResourceAdmin config={academicResourceConfigs['homework']} />;
}
