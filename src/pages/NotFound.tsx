import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#050a15] text-white p-8">
      <div className="max-w-3xl mx-auto py-16">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-white/70">
          That route doesn't exist yet.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}