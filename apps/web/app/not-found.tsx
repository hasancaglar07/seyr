import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <article className="surface-panel w-full rounded-[2rem] p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--sky-600)]">404</p>
        <h1 className="mt-4 font-serif text-5xl leading-[0.94] text-[color:var(--sky-950)] sm:text-6xl">
          AradÄ±ÄŸÄ±nÄ±z iÃ§erik burada deÄŸil.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[color:rgba(12,74,110,0.72)]">
          Ä°Ã§erik yeni yapÄ±ya taÅŸÄ±nmÄ±ÅŸ, adÄ± deÄŸiÅŸmiÅŸ veya henÃ¼z yayÄ±na alÄ±nmamÄ±ÅŸ olabilir. Ana sayfaya dÃ¶nerek yeni iÃ§erik akÄ±ÅŸÄ±ndan devam edebilirsiniz.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">Ana Sayfaya DÃ¶n</Link>
          </Button>
        </div>
      </article>
    </main>
  );
}

