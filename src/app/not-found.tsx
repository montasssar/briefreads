// src/app/not-found.tsx
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-3xl font-bold tracking-tight">
        404 – Page Not Found
      </h1>
      <p className="text-sm opacity-70 max-w-md text-center">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
    </main>
  );
}
