import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Yonetim | SeyrDijital",
  description: "SeyrDijital admin paneli",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage(["ADMIN", "EDITOR"]);
  return <>{children}</>;
}

