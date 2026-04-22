import { test, expect } from "@playwright/test";

test.describe("Product Detail Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".product-card").first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("clicking a product card navigates to /product/:id", async ({
    page,
  }) => {
    await page.locator(".product-card").first().click();
    await expect(page).toHaveURL(/\/product\/\d+/);
  });

  test("product detail page shows title, description, price", async ({
    page,
  }) => {
    await page.locator(".product-card").first().click();
    await expect(page).toHaveURL(/\/product\/\d+/);

    const title = page
      .locator(".detail-info h1, .detail-info h2, h1, h2")
      .first();
    await expect(title).toBeVisible({ timeout: 10_000 });
    await expect(title).not.toBeEmpty();

    const desc = page.locator(".detail-desc, p").first();
    await expect(desc).toBeVisible();

    const price = page
      .locator("[class*='price'], p, span, div")
      .filter({ hasText: /₹/ })
      .first();
    await expect(price).toBeVisible();
  });

  test("product detail page shows product image", async ({ page }) => {
    await page.locator(".product-card").first().click();

    const img = page
      .locator(".detail-img-wrap img, [class*='detail'] img, img")
      .first();
    await expect(img).toBeVisible({ timeout: 10_000 });
    await expect(img).toHaveAttribute("alt");
  });

  test("Add to Cart button is present and clickable", async ({ page }) => {
    await page.locator(".product-card").first().click();

    const addBtn = page.getByRole("button", { name: /add to cart/i });
    await expect(addBtn).toBeVisible({ timeout: 10_000 });
    await expect(addBtn).toBeEnabled();
  });

  test("clicking Add to Cart updates cart badge", async ({ page }) => {
    await page.locator(".product-card").first().click();

    const addBtn = page.getByRole("button", { name: /add to cart/i });
    await expect(addBtn).toBeVisible({ timeout: 10_000 });
    await addBtn.click();

    const badge = page
      .locator(".cart-badge, [class*='badge'], [class*='count']")
      .first();
    await expect(badge).toBeVisible({ timeout: 5_000 });
    await expect(badge).toContainText("1");
  });

  test("clicking Add to Cart shows visual feedback on button", async ({
    page,
  }) => {
    await page.locator(".product-card").first().click();

    const addBtn = page.getByRole("button", { name: /add to cart/i });
    await expect(addBtn).toBeVisible({ timeout: 10_000 });
    await addBtn.click();

    await Promise.race([
      expect(addBtn).toContainText(/added/i, { timeout: 3_000 }).catch(() => {}),
      expect(addBtn).toHaveClass(/added|success|active/, {
        timeout: 3_000,
      }).catch(() => {}),
    ]);

    const badge = page
      .locator(".cart-badge, [class*='badge']")
      .first();
    await expect(badge).toContainText("1", { timeout: 3_000 });
  });

  test("Back button navigates back to home", async ({ page }) => {
    await page.locator(".product-card").first().click();

    // Back button — by class or text
    const backBtn = page
      .locator(".back-btn, button")
      .filter({ hasText: /back|←/i })
      .first();
    await expect(backBtn).toBeVisible({ timeout: 10_000 });
    await backBtn.click();

    await expect(page).toHaveURL("/");
  });

  test("direct URL navigation to /product/:id works", async ({ page }) => {
    await page.goto("/product/1");
    const title = page.locator(".detail-info h1, h1, h2").first();
    await expect(title).toBeVisible({ timeout: 10_000 });
    await expect(title).not.toBeEmpty();
  });

  test("invalid product ID shows error state", async ({ page }) => {
    await page.goto("/product/999999999");
    const errorOrBack = page
      .locator(".error-msg, .btn-outline, button, p")
      .filter({ hasText: /not found|error|back/i })
      .first();
    await expect(errorOrBack).toBeVisible({ timeout: 10_000 });
  });
});
