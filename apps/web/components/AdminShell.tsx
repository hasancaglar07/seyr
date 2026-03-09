import Link from "next/link";
import { AdminSignOutButton } from "@/components/AdminSignOutButton";
import { getCurrentAdmin } from "@/lib/admin-auth";

export async function AdminShell({ title, children }: { title: string; children: any }) {
  const admin = await getCurrentAdmin();

  return (
    <div className="admin-layout">
      <aside className="admin-side">
        <h2>Yonetim</h2>
        <nav>
          <ul>
            <li><Link href="/yonetim">Dashboard</Link></li>
            <li><Link href="/yonetim/streams">Stream Yonetimi</Link></li>
            <li><Link href="/yonetim/schedule">Yayin Akisi</Link></li>
            <li><Link href="/yonetim/programs">Programlar</Link></li>
            <li><Link href="/yonetim/presenters">Programcilar</Link></li>
            <li><Link href="/yonetim/pages">Sayfalar</Link></li>
            <li><Link href="/yonetim/media">Medya</Link></li>
            <li><Link href="/yonetim/messages">Iletisim</Link></li>
            <li><Link href="/yonetim/push">Duyuru / Push</Link></li>
            <li><Link href="/yonetim/import">Legacy Import</Link></li>
            <li><Link href="/yonetim/users">Kullanici / Rol</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>{title}</h1>
            <p>Web, mobil ve API icerikleri ortak veri kaynagindan yonetilir.</p>
          </div>
          {admin ? (
            <div className="admin-session">
              <div>
                <strong>{admin.fullName ?? admin.email ?? "Admin"}</strong>
                <p>
                  {admin.role}
                  {admin.source === "development" ? " · Local Dev" : admin.email ? ` · ${admin.email}` : ""}
                </p>
              </div>
              <AdminSignOutButton enabled={admin.source === "supabase"} />
            </div>
          ) : null}
        </header>
        {children}
      </main>
    </div>
  );
}
