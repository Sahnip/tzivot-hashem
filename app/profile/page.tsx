import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { getProfile } from "@/lib/actions/profile";
import { getAuthenticatedUser } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/login");
  }

  const profileResult = await getProfile();
  if (!profileResult.success) {
    redirect("/login");
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Mon profil</h1>
        <ProfileForm profile={profileResult.data} email={user.email ?? ""} />
      </main>
    </>
  );
}
