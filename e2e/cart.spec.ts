import { test, expect } from "@playwright/test";

test.describe("Cart Page", () => {
  const addFirstProductToCart = async (page: any) => {
    await page.goto("/");
    await expect(page.locator(".product-card").first()).toBeVisible({
      timeout: 15_000,
    });
    await page.locator(".product-card").first().click();

    const addBtn = page.getByRole("button", { name: /add to cart/i });
    await expect(addBtn).toBeVisible({ timeout: 10_000 });
    await addBtn.click();

    await expect(
      page.locator(".cart-badge, [class*='badge'], [class*='count']").first()
    ).toBeVisible({ timeout: 5_000 });
  };

  test("empty cart shows empty state message", async ({ page }) => {
    await page.goto("/cart");
    await expect(
      page.locator("p, div, span").filter({ hasText: /empty/i }).first()
    ).toBeVisible({ timeout: 5_000 });
  });

  test("Browse Products button on empty cart navigates home", async ({
    page,
  }) => {
    await page.goto("/cart");
    const browseBtn = page
      .locator("button, a")
      .filter({ hasText: /browse|shop|product/i })
      .first();
    await expect(browseBtn).toBeVisible({ timeout: 5_000 });
    await browseBtn.click();
    await expect(page).toHaveURL("/");
  });

  test("added item appears in cart", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/cart");

    const cartItems = page.locator(".cart-item");
    await expect(cartItems.first()).toBeVisible({ timeout: 5_000 });
    const count = await cartItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test("cart item shows title and price", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/cart");

    const item = page.locator(".cart-item").first();
    await expect(item).toBeVisible({ timeout: 5_000 });

    await expect(item.locator(".cart-item-title")).not.toBeEmpty();
    await expect(
      item.locator("p, span").filter({ hasText: /₹/ }).first()
    ).toBeVisible();
    await expect(item.locator(".qty-value")).toHaveText("1");
  });

  test("clicking + increases item quantity", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/cart");

    const item = page.locator(".cart-item").first();
    await expect(item).toBeVisible({ timeout: 5_000 });

    // aria-label matches exactly what Cart.tsx has
    await item.getByRole("button", { name: "Increase quantity" }).click();

    await expect(item.locator(".qty-value")).toHaveText("2");
  });

  test("clicking − decreases item quantity", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/cart");

    const item = page.locator(".cart-item").first();
    await expect(item).toBeVisible({ timeout: 5_000 });

    // Increase to 2 first
    await item.getByRole("button", { name: "Increase quantity" }).click();
    await expect(item.locator(".qty-value")).toHaveText("2");

    // Then decrease back to 1
    await item.getByRole("button", { name: "Decrease quantity" }).click();
    await expect(item.locator(".qty-value")).toHaveText("1");
  });

  test("decreasing quantity to 0 removes item", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/cart");

    const item = page.locator(".cart-item").first();
    await expect(item).toBeVisible({ timeout: 5_000 });

    await item.getByRole("button", { name: "Decrease quantity" }).click();

    await expect(
      page.locator("p, div, span").filter({ hasText: /empty/i }).first()
    ).toBeVisible({ timeout: 3_000 });
  });

  test("Remove button removes item from cart", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/cart");

    await expect(page.locator(".cart-item").first()).toBeVisible({
      timeout: 5_000,
    });

    // aria-label="Remove from cart" as in Cart.tsx
    await page.getByRole("button", { name: /remove from cart/i }).first().click();

    await expect(
      page.locator("p, div, span").filter({ hasText: /empty/i }).first()
    ).toBeVisible({ timeout: 3_000 });
  });

  test("cart state persists after page reload (localStorage)", async ({
    page,
  }) => {
    await addFirstProductToCart(page);
    await page.goto("/cart");
    await expect(page.locator(".cart-item").first()).toBeVisible({
      timeout: 5_000,
    });

    await page.reload();
    await expect(page.locator(".cart-item").first()).toBeVisible({
      timeout: 5_000,
    });

    const badge = page
      .locator(".cart-badge, [class*='badge'], [class*='count']")
      .first();
    await expect(badge).toBeVisible();
  });
});