import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navbar brand link goes to home from any page", async ({ page }) => {
    await page.goto("/product/1");
    await page.waitForURL(/\/product\/1/);

    await page.locator(".navbar-brand").click();
    await expect(page).toHaveURL("/");
  });

  test("cart icon in navbar navigates to /cart", async ({ page }) => {
    await page.goto("/");
    await page.locator(".cart-btn").click();
    await expect(page).toHaveURL("/cart");
  });

  test("Products nav link navigates to home", async ({ page }) => {
    await page.goto("/cart");
    const navLink = page
      .locator(".nav-link, .navbar a[href='/'], nav a")
      .first();
    await expect(navLink).toBeVisible({ timeout: 5_000 });
    await navLink.click();
    await expect(page).toHaveURL("/");
  });

  test("navigating back from product detail preserves home page filters", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator(".chip").first()).toBeVisible({
      timeout: 10_000,
    });

    await page.locator(".chip").first().click();
    const filteredUrl = page.url();
    expect(filteredUrl).toMatch(/cat=/);

    await expect(page.locator(".product-card").first()).toBeVisible({
      timeout: 15_000,
    });
    await page.locator(".product-card").first().click();

    await page.goBack();
    await expect(page).toHaveURL(filteredUrl);

    await expect(page.locator(".chip").first()).toHaveClass(/chip-active/, {
      timeout: 5_000,
    });
  });

  test("unknown route does not crash — shows navbar", async ({ page }) => {
    await page.goto("/unknown-route");
    await expect(page.locator(".navbar, nav").first()).toBeVisible();
  });
});
