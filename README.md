# HabitTrack — Suivi d'habitudes personnelles

Application web minimaliste de tracking d'habitudes avec grille annuelle interactive, authentification Supabase et isolation stricte des données par utilisateur.

## Stack technique

- **Frontend** : Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Lucide, React Hook Form, Zod, TanStack Query
- **Backend** : Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS)
- **Déploiement** : Vercel + Supabase

## Fonctionnalités

- Inscription / connexion / déconnexion sécurisées
- Gestion du profil (nom, fuseau horaire, mot de passe)
- CRUD des habitudes
- Grille de 365/366 jours (année civile) par habitude
- Cycle à 3 clics : vide → vert → rouge → vide
- Sauvegarde automatique avec mise à jour optimiste
- Mode clair / sombre
- Interface responsive et accessible

## Gestion des dates

- **Période affichée** : année civile sélectionnée (1er janvier – 31 décembre)
- **Nombre de cases** : 365 ou 366 selon année bissextile
- **Fuseau horaire** : défini dans le profil utilisateur pour calculer « aujourd'hui »
- **Dates futures** : désactivées (non cliquables) dans l'année en cours

## Architecture

```
app/
  (auth)/login, register
  dashboard/, habits/, profile/
  api/habits/, api/habit-entries/
components/
  auth/, habits/, dashboard/, profile/, ui/
lib/
  supabase/, validations/, actions/, dates/
supabase/migrations/
  001_initial_schema.sql
  002_rls_policies.sql
```

## Installation locale

### 1. Cloner et installer

```bash
npm install
cp .env.example .env.local
```

### 2. Configurer Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Copiez l'URL et la clé `anon` dans `.env.local`
3. Exécutez les migrations dans l'éditeur SQL Supabase :
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
4. (Optionnel) Désactivez la confirmation e-mail pour le dev :
   - Authentication → Providers → Email → désactiver « Confirm email »

### 3. Variables d'environnement

| Variable | Visibilité | Description |
|----------|------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Publique | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publique | Clé anonyme (safe côté client) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Privée** | Clé admin — jamais côté client |

> La clé `SUPABASE_SERVICE_ROLE_KEY` n'est pas utilisée par l'application standard (RLS + clé anon suffisent).

### 4. Lancer en développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Commandes de vérification

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run test        # Tests unitaires (Vitest)
npm run test:e2e    # Tests E2E (Playwright, serveur requis)
npm run build       # Build production
```

## Déploiement Vercel

1. Poussez le code sur GitHub
2. Importez le projet dans [Vercel](https://vercel.com)
3. Ajoutez les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Déployez

Dans Supabase → Authentication → URL Configuration, ajoutez :
- Site URL : `https://votre-domaine.vercel.app`
- Redirect URLs : `https://votre-domaine.vercel.app/**`

## Sécurité

- RLS activé sur `profiles`, `habits`, `habit_entries`
- `user_id` toujours dérivé de `auth.uid()` côté serveur
- Validation Zod sur toutes les entrées
- Middleware Next.js pour protéger `/dashboard`, `/habits`, `/profile`
- Aucune clé secrète exposée côté client

## Tests

**Unitaires** (Vitest) :
- Cycle d'états `getNextStatus`
- Validation du nom d'habitude
- Validation des dates et années bissextiles
- Calcul des statistiques

**E2E** (Playwright) :
- Pages publiques
- Redirection des routes privées

## Licence

MIT
