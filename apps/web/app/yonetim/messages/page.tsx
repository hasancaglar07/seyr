import { AdminShell } from "@/components/AdminShell";
import { listContactMessages } from "@/lib/repository";

export default async function AdminMessagesPage() {
  const messages = await listContactMessages();

  return (
    <main>
      <AdminShell title="Iletisim Mesajlari">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Ad Soyad</th>
              <th>E-posta</th>
              <th>Konu</th>
            </tr>
          </thead>
          <tbody>
            {messages.length > 0 ? (
              messages.map((message) => (
                <tr key={message.id}>
                  <td>{new Date(message.createdAt).toLocaleString("tr-TR")}</td>
                  <td>{message.fullName}</td>
                  <td>{message.email}</td>
                  <td>{message.subject}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>Henuz mesaj yok.</td>
              </tr>
            )}
          </tbody>
        </table>
      </AdminShell>
    </main>
  );
}

