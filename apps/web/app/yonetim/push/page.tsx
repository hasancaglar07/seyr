import { AdminShell } from "@/components/AdminShell";
import { PushCampaignForm } from "@/components/PushCampaignForm";
import { listPushCampaigns } from "@/lib/repository";

export default async function AdminPushPage() {
  const campaigns = await listPushCampaigns();

  return (
    <main>
      <AdminShell title="Duyuru ve Push">
        <PushCampaignForm />
        <table className="admin-table" style={{ marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Kanal</th>
              <th>Baslik</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td>{new Date(campaign.createdAt).toLocaleString("tr-TR")}</td>
                  <td>{campaign.channel}</td>
                  <td>{campaign.title}</td>
                  <td>{campaign.sentAt ? "Gonderildi" : "Planlandi"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>Henuz kampanya yok.</td>
              </tr>
            )}
          </tbody>
        </table>
      </AdminShell>
    </main>
  );
}

