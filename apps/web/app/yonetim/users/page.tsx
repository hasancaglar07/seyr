import { AdminShell } from "@/components/AdminShell";
import { listAdminUsers } from "@/lib/repository";

export default async function AdminUsersPage() {
  const users = await listAdminUsers();

  return (
    <main>
      <AdminShell title="Kullanici ve Roller">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>Rol</th>
              <th>Durum</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName ?? "Adsiz Kullanici"}</td>
                <td>{user.role}</td>
                <td>{user.isActive ? "Aktif" : "Pasif"}</td>
                <td>{user.userId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminShell>
    </main>
  );
}

