import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load and display the navbar with brand and cart icon", async ({
    page,
  }) => {
    await expect(page).toHaveTitle(/ecommerce/i);
    const brand = page.locator(".navbar-brand");
    await expect(brand).toBeVisible();

    const cartBtn = page.locator(".navbar .cart-btn, .navbar button").first();
    await expect(cartBtn).toBeVisible();
  });

  test("should display the filter and sort section", async ({ page }) => {
    const filterSection = page
      .locator(".filter-section, [aria-label='Filters and Sorting']")
      .first();
    await expect(filterSection).toBeVisible();

    const sortSelect = page.locator(
      ".sort-select, select[id='sort-select'], select"
    ).first();
    await expect(sortSelect).toBeVisible();
  });

  test("should load category filter chips from API", async ({ page }) => {
    const chips = page.locator(".chip");
    await expect(chips.first()).toBeVisible({ timeout: 10_000 });
    const count = await chips.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should load and display product cards", async ({ page }) => {
    const cards = page.locator(".product-card");
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });

    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("each product card shows title and price", async ({ page }) => {
    const cards = page.locator(".product-card");
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });

    const firstCard = cards.first();

    const title = firstCard.locator(
      ".product-title, h3, h4"
    ).first();
    await expect(title).not.toBeEmpty();

    const priceEl = firstCard.locator(".product-price, p, span").filter({
      hasText: /₹/,
    }).first();
    await expect(priceEl).toBeVisible();
  });

  test("should show result count", async ({ page }) => {
    const count = page.locator(".results-count");
    await expect(count).toBeVisible({ timeout: 15_000 });
    await expect(count).toContainText(/product/i);
  });
});
