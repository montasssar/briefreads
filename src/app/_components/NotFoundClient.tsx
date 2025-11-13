'use client';

import { useSearchParams } from 'next/navigation';

export function NotFoundClient() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') ?? 'page_not_found';

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <h1 className="text-3xl font-bold">Page Not Found</h1>
      <p className="text-sm opacity-70">
        Something went wrong: <span className="font-mono">{reason}</span>
      </p>
    </div>
  );
}
