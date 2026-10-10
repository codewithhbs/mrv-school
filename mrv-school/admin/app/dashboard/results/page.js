'use client';

import ResultsAdmin from '@/components/ResultsAdmin';
import { resultsConfig } from '@/lib/resourceConfigs';

export default function Page() {
  return <ResultsAdmin config={resultsConfig} />;
}
