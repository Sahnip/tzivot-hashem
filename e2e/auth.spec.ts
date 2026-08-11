import { test, expect } from "@playwright/test";

test.describe("Public pages", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "HabitTrack" })).toBeVisible();
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
  });

  test("register page loads", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: "Inscription" })).toBeVisible();
  });

  test("redirects unauthenticated users from dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
