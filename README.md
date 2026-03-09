# SeyrDijital Monorepo

Bu repo SeyrDijital V1 icin asagidaki uygulama ve paketleri icerir:

- `apps/web`: Next.js public site, `/yonetim` admin paneli, `/api/v1` REST API
- `apps/mobile`: Expo Router Android/iOS uygulamasi
- `packages/contracts`: Zod ve TypeScript ortak veri sozlesmeleri
- `packages/ui`: ortak UI bilesenleri
- `supabase`: migration ve seed SQL dosyalari

## Hemen Basla

```bash
pnpm install
pnpm dev
```

Ayrik calistirma:

```bash
pnpm dev:web
pnpm dev:mobile
```

## Onemli Komutlar

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm import:legacy
pnpm import:legacy:apply
pnpm report:legacy
```

`pnpm import:legacy` mevcut seyrdijital.com iceriginden `scripts/legacy-export.json` uretir.

`pnpm import:legacy:apply` bu export dosyasini aktif veri katmanina uygular:

- Supabase env degerleri varsa veriler Supabase'a yazilir
- Supabase yoksa local in-memory fallback uzerinde smoke test olarak calisir

## Supabase Kurulumu

1. `supabase/migrations/20260307_init.sql` dosyasini uygulayin.
2. `supabase/seed.sql` ile baslangic verisini yukleyin.
3. `apps/web/.env.example` ve gerekiyorsa `apps/mobile/.env.example` dosyalarini doldurun.

Gerekli web env degerleri:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` veya `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Admin Notlari

- Supabase env degerleri varsa admin panel cookie tabanli oturum ile korunur.
- Supabase env yoksa local gelistirme icin `development admin` fallback aciktir.
- Desteklenen roller: `ADMIN`, `EDITOR`
- `ADMIN` push ve kullanici listeleme dahil tum modullere erisir.
- `EDITOR` icerik, stream, sayfa ve akis yonetebilir.
- Auth kullanicisini admin yapmak icin ilgili `auth.users.id` degeri `public.admin_users` tablosuna eklenmelidir.

## Legacy Import

Admin panelde `/yonetim/import` ekraninda:

- export ozeti gorulur
- `Legacy import` butonu ile import tetiklenir

CLI tarafinda ayni akisi terminalden de calistirabilirsiniz:

```bash
pnpm import:legacy:apply
```
