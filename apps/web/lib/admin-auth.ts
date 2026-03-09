import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import type { AdminRole } from "@seyir/contracts";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { getServiceSupabaseClient, hasSupabaseConfig } from "@/lib/supabase";

export type AdminIdentity = {
  userId: string;
  email: string | null;
  fullName: string | null;
  role: AdminRole;
  source: "development" | "supabase";
};

const DEVELOPMENT_ADMIN: AdminIdentity = {
  userId: "local-development",
  email: "local@seyirdijital.dev",
  fullName: "Local Development Admin",
  role: "ADMIN",
  source: "development",
};

async function readAdminMembership(userId: string) {
  const serviceClient = getServiceSupabaseClient();

  if (serviceClient) {
    const { data, error } = await serviceClient
      .from("admin_users")
      .select("role,full_name,is_active")
      .eq("user_id", userId)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  const serverClient = await getServerSupabaseClient();
  if (!serverClient) {
    return null;
  }

  const { data, error } = await serverClient
    .from("admin_users")
    .select("role,full_name,is_active")
    .eq("user_id", userId)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getCurrentAdmin(): Promise<AdminIdentity | null> {
  if (!hasSupabaseConfig()) {
    return DEVELOPMENT_ADMIN;
  }

  const serverClient = await getServerSupabaseClient();
  if (!serverClient) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await serverClient.auth.getUser();

  if (error || !user) {
    return null;
  }

  const membership = await readAdminMembership(user.id);
  if (!membership?.is_active || (membership.role !== "ADMIN" && membership.role !== "EDITOR")) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    fullName: membership.full_name ?? ((user.user_metadata?.full_name as string | undefined) ?? null),
    role: membership.role,
    source: "supabase",
  };
}

export async function requireAdminPage(allowedRoles: AdminRole[]) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/giris?error=auth&redirect=/yonetim");
  }

  if (!allowedRoles.includes(admin.role)) {
    redirect("/giris?error=forbidden&redirect=/yonetim");
  }

  return admin;
}

export async function requireAdminRole(_request: NextRequest, allowedRoles: AdminRole[]) {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return {
        ok: false as const,
        response: Response.json(
          {
            error: "Oturum gerekli",
            detail: "Admin API erisimi icin giris yapmaniz gerekir.",
          },
          { status: 401 },
        ),
      };
    }

    if (!allowedRoles.includes(admin.role)) {
      return {
        ok: false as const,
        response: Response.json(
          {
            error: "Yetkisiz erisim",
            detail: "Bu islem icin gerekli role sahip degilsiniz.",
          },
          { status: 403 },
        ),
      };
    }

    return {
      ok: true as const,
      role: admin.role,
      admin,
    };
  } catch (error) {
    return {
      ok: false as const,
      response: Response.json(
        {
          error: "Auth dogrulanamadi",
          detail: String(error),
        },
        { status: 500 },
      ),
    };
  }
}
