import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-4">
      <div className="text-center text-white">
        <p className="text-8xl font-bold opacity-80 mb-4">404</p>
        <h1 className="text-2xl font-semibold mb-3">Page Not Found</h1>
        <p className="text-white/70 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/ja"
          className="inline-block px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors backdrop-blur-sm"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
