import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getCurrentAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin Girisi | SeyrDijital",
  description: "SeyrDijital admin oturum girisi",
};

function sanitizeRedirect(value: string | string[] | undefined) {
  const redirectTo = Array.isArray(value) ? value[0] : value;
  if (!redirectTo || !redirectTo.startsWith("/")) {
    return "/yonetim";
  }

  return redirectTo;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = sanitizeRedirect(params.redirect);
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect(redirectTo);
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="auth-layout">
        <AdminLoginForm redirectTo={redirectTo} error={params.error ?? null} />
      </div>
    </main>
  );
}

