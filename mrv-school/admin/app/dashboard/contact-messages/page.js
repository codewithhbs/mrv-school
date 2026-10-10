'use client';

import ReviewQueue from '@/components/ReviewQueue';
import { reviewQueueConfigs } from '@/lib/resourceConfigs';

export default function Page() {
  return <ReviewQueue config={reviewQueueConfigs['contact-messages']} />;
}
