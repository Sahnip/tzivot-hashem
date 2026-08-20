"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhysicalGlassButton } from "../ui/PhysicalGlassButton";
import { usePhysicalGlass } from "../../app/hook/usePhysicalGlass";

const oauthProviders = [
  { provider: "google", label: "Google", icon: "/google.svg" },
  { provider: "github", label: "GitHub", icon: "/github.svg" },
  { provider: "linkedin", label: "LinkedIn", icon: "/linkedin.svg" },
] as const;

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitGlass = usePhysicalGlass();
  
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function handleOAuthLogin(provider: (typeof oauthProviders)[number]["provider"]) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=%2Fdashboard`,
      },
    });

    if (error) {
      toast.error("Connexion impossible avec ce fournisseur.");
    }
  }


  async function onSubmit(values: LoginInput) {
    setIsSubmitting(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    
    setIsSubmitting(false);

    if (error) {
      toast.error("E-mail ou mot de passe incorrect.");
      return;
    }
    toast.success("Connexion réussie");
    router.push("/dashboard");
    // router.refresh();
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleLogin = (e: React.FormEvent, values: LoginInput) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSubmit(values);
      // toast.success("Connexion réussie");
      // router.push("/dashboard");
    })
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Connectez-vous pour suivre vos habitudes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid gap-2 sm:grid-cols-3">
          {oauthProviders.map(({ provider, label, icon }) => (
            <Button
              key={provider}
              type="button"
              variant="outline"
              className="liquid-glass flex items-center justify-center gap-2"
              onClick={() => handleOAuthLogin(provider)}
              autoFocus
              
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-bold">
                {icon && (
                  <img src={icon} alt={label} className="h-full w-full object-contain" />
                )}
              </span>
              {label}
            </Button>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>ou</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={(e) => (handleLogin(e,  form.getValues()))} className="space-y-4">
          <div className="space-y-2 flex flex-col gap-1">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...form.register("email")}
              aria-invalid={!!form.formState.errors.email}
              autoFocus
              required
              className="liquid-glass"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2 flex flex-col gap-1">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...form.register("password")}
              aria-invalid={!!form.formState.errors.password}
              autoFocus
              required
              className="liquid-glass"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-[#00bc7d] underline-offset-4 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            {/* <Button 
              type="submit" 
              className="liquid-glass physical-glass w-full sm:max-w-7/12 items-center justify-center" 
              disabled={isSubmitting}
              
              >
              {isSubmitting ? "Connexion…" : "Se connecter"}
            </Button> */}
            <Button
              type="submit"
              disabled={isSubmitting}
              onPointerEnter={submitGlass.onPointerEnter}
              onPointerLeave={submitGlass.onPointerLeave}
              onPointerDown={submitGlass.onPointerDown}
              onPointerUp={submitGlass.onPointerUp}
              className={submitGlass.getClass(
                "liquid-glass w-full sm:max-w-7/12 items-center justify-center"
              )}
              >
                {isSubmitting ? "Connexion…" : "Se connecter"}
              </Button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/register" className=" text-[#00bc7d] underline-offset-4 hover:underline ">
            S&apos;inscrire
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
