"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOut } from "@/lib/actions/profile";
import { Button, type ButtonProps } from "@/components/ui/button";

interface SignOutButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function SignOutButton({ children, ...props }: SignOutButtonProps) {
  const router = useRouter();

  async function handleSignOut() {
    const result = await signOut();
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <Button type="button" onClick={handleSignOut} {...props}>
      {children}
    </Button>
  );
}
