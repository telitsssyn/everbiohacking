import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <h1 className="font-serif text-3xl">404</h1>
        <p className="mt-2 text-white/60">
          Page not found · Страница не найдена
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/en"
            className="rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/5"
          >
            Go home
          </Link>
          <Link
            href="/ru"
            className="rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/5"
          >
            На главную
          </Link>
        </div>
      </body>
    </html>
  );
}
