import { test, expect } from "@playwright/test";

test.describe("Accessibility & Responsiveness", () => {
  test("product cards are keyboard navigable", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".product-card").first()).toBeVisible({
      timeout: 15_000,
    });

    await page.locator(".product-card").first().focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/product\/\d+/);
  });

  test("cart button has accessible aria-label or title", async ({ page }) => {
    await page.goto("/");
    const cartBtn = page.locator(".cart-btn").first();
    await expect(cartBtn).toBeVisible();

    const ariaLabel = await cartBtn.getAttribute("aria-label");
    const title = await cartBtn.getAttribute("title");
    expect(ariaLabel || title).toBeTruthy();
  });

  test("product grid has semantic list role or grid structure", async ({
    page,
  }) => {
    await page.goto("/");
    const listOrGrid = page
      .locator('[role="list"], .products-grid, [class*="grid"]')
      .first();
    await expect(listOrGrid).toBeVisible({ timeout: 15_000 });
  });

  test("mobile viewport: product grid still renders", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.locator(".product-card").first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("mobile viewport: navbar is visible and usable", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.locator(".navbar, nav").first()).toBeVisible();

    await expect(page.locator(".navbar-brand").first()).toBeVisible();
  });

  test("mobile viewport: cart page layout renders correctly", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/cart");
    await expect(page.locator(".cart-page, main").first()).toBeVisible();
  });
});
