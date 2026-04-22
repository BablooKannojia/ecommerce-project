import { test, expect } from "@playwright/test";

test.describe("Filter & Sort", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".chip").first()).toBeVisible({ timeout: 10_000 });
    await expect(page.locator(".product-card").first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("selecting a category chip adds ?cat= to URL", async ({ page }) => {
    const firstChip = page.locator(".chip").first();
    await firstChip.click();

    await expect(page).toHaveURL(/[?&]cat=\d+/);
    await expect(firstChip).toHaveClass(/chip-active/);

    await expect(page.locator(".product-card, .skeleton-card").first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("can select multiple category chips simultaneously", async ({ page }) => {
    const chips = page.locator(".chip");
    const count = await chips.count();

    if (count < 2) {
      test.skip();
      return;
    }

    await chips.nth(0).click();
    await chips.nth(1).click();

    const url = page.url();
    const params = new URL(url).searchParams.getAll("cat");
    expect(params.length).toBe(2);

    await expect(chips.nth(0)).toHaveClass(/chip-active/);
    await expect(chips.nth(1)).toHaveClass(/chip-active/);
  });

  test("deselecting a chip removes it from URL", async ({ page }) => {
    const firstChip = page.locator(".chip").first();
    await firstChip.click();
    await expect(page).toHaveURL(/cat=/);

    await firstChip.click();
    const url = page.url();
    expect(url).not.toMatch(/cat=/);
    await expect(firstChip).not.toHaveClass(/chip-active/);
  });

  test("URL filters survive page refresh", async ({ page }) => {
    const firstChip = page.locator(".chip").first();
    await firstChip.click();

    const urlAfterFilter = page.url();
    await page.reload();

    await expect(page).toHaveURL(urlAfterFilter);
    await expect(page.locator(".chip").first()).toHaveClass(/chip-active/, {
      timeout: 10_000,
    });
  });

  test("sort by Price: Low → High reorders products", async ({ page }) => {
    const sortSelect = page.locator(".sort-select, select").first();
    await sortSelect.selectOption("price-asc");

    await expect(page).toHaveURL(/sort=price-asc/);

    await page.waitForTimeout(500);
    await expect(page.locator(".product-card").first()).toBeVisible({
      timeout: 10_000,
    });

    const priceEls = page.locator(".product-price");
    const count = await priceEls.count();
    expect(count).toBeGreaterThan(1);

    const prices: number[] = [];
    for (let i = 0; i < Math.min(count, 5); i++) {
      const text = (await priceEls.nth(i).textContent()) ?? "0";
      const val = parseFloat(text.replace(/[^\d.]/g, ""));
      if (!isNaN(val)) prices.push(val);
    }

    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  test("sort by Price: High → Low reorders products", async ({ page }) => {
    const sortSelect = page.locator(".sort-select, select").first();
    await sortSelect.selectOption("price-desc");

    await expect(page).toHaveURL(/sort=price-desc/);

    await page.waitForTimeout(500);
    await expect(page.locator(".product-card").first()).toBeVisible({
      timeout: 10_000,
    });

    const priceEls = page.locator(".product-price");
    const count = await priceEls.count();
    expect(count).toBeGreaterThan(1);

    const prices: number[] = [];
    for (let i = 0; i < Math.min(count, 5); i++) {
      const text = (await priceEls.nth(i).textContent()) ?? "0";
      const val = parseFloat(text.replace(/[^\d.]/g, ""));
      if (!isNaN(val)) prices.push(val);
    }

    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  });

  test("Clear All button removes all filters from URL", async ({ page }) => {
    const chips = page.locator(".chip");
    await chips.first().click();

    const sortSelect = page.locator(".sort-select, select").first();
    await sortSelect.selectOption("price-asc");

    const clearBtn = page.locator(".clear-btn, button").filter({
      hasText: /clear/i,
    }).first();
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();

    const url = page.url();
    expect(url).not.toMatch(/cat=/);
    expect(url).not.toMatch(/sort=/);
    await expect(clearBtn).not.toBeVisible();
  });

  test("sort param persists in URL after page reload", async ({ page }) => {
    const sortSelect = page.locator(".sort-select, select").first();
    await sortSelect.selectOption("name-asc");

    await page.reload();

    const reloadedSelect = page.locator(".sort-select, select").first();
    await expect(reloadedSelect).toHaveValue("name-asc", { timeout: 5_000 });
  });
});
