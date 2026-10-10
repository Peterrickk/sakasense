import { expect, test } from "@playwright/test";

test("home loads and nav reaches products", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Know your soil");
  await page.goto("/products");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("The SakaSense system");
});

test("mobile menu opens and navigates", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("link", { name: "How it Works" }).first().click();
  await expect(page).toHaveURL(/how-it-works/);
});

test("admin is hidden from anonymous users", async ({ page }) => {
  const res = await page.goto("/admin");
  expect(res?.status()).toBe(404);
});

test("unpriced product cannot be added to cart", async ({ page }) => {
  await page.goto("/products/sakasense-device");
  await expect(page.getByRole("link", { name: /ask about availability/i }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /add to cart/i })).toHaveCount(0);
});

test("track-order form validates", async ({ page }) => {
  await page.goto("/orders/track");
  await page.getByRole("button", { name: "Track order" }).click();
  await expect(page.getByRole("alert").first()).toBeVisible();
});

test("custom 404", async ({ page }) => {
  await page.goto("/nope");
  await expect(page.getByText("lost in the field")).toBeVisible();
});
