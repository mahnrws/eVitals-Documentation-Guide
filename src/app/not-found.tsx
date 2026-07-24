import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="max-w-md text-center px-6">
        <div className="mb-6">
          <img src="/logo.png" alt="e-Vitals" className="h-10 mx-auto mb-6" />
        </div>
        <h1 className="text-6xl font-bold text-foreground tracking-tight">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            href="/docs/super-admin"
            className="inline-flex items-center justify-center rounded-xl bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all hover:bg-foreground/90 shadow-sm"
          >
            Go to docs
          </Link>
        </div>
      </div>
    </div>
  );
}
