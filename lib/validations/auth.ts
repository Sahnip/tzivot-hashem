import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Adresse e-mail invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
    displayName: z
      .string()
      .trim()
      .max(50, "Le nom d'affichage ne peut pas dépasser 50 caractères")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mot de passe actuel requis"),
    newPassword: z
      .string()
      .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .max(50, "Le nom d'affichage ne peut pas dépasser 50 caractères")
    .optional()
    .or(z.literal("")),
  timezone: z.string().min(1, "Fuseau horaire requis"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
