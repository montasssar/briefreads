import { Suspense } from 'react';
import { NotFoundClient } from './_components/NotFoundClient';

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Loading…</div>}>
      <NotFoundClient />
    </Suspense>
  );
}
