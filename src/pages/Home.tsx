import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import {
  fetchAllProducts,
  fetchCategories,
  fetchProductsByCategory,
} from "../services/api";
import type { Category, Product } from "../types";

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCats = searchParams.getAll("cat").map(Number);
  const sortBy = (searchParams.get("sort") as SortOption) ?? "default";

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      let data: Product[];
      if (selectedCats.length === 0) {
        data = await fetchAllProducts();
        console.log("products", data);
      } else {
        const results = await Promise.all(
          selectedCats.map((id) => fetchProductsByCategory(id))
        );
        const map = new Map<number, Product>();
        results.flat().forEach((p) => map.set(p.id, p));
        data = Array.from(map.values());
      }

      data = data.filter(
        (p) => p && p.id && p.title && typeof p.price === "number"
      );

      setProducts(data);
    } finally {
      setLoading(false);
    }
  }, [searchParams.toString()]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const toggleCategory = (id: number) => {
    const updated = selectedCats.includes(id)
      ? selectedCats.filter((c) => c !== id)
      : [...selectedCats, id];

    const params = new URLSearchParams(searchParams);
    params.delete("cat");
    updated.forEach((c) => params.append("cat", String(c)));
    setSearchParams(params);
  };

  const handleSort = (value: SortOption) => {
    const params = new URLSearchParams(searchParams);
    if (value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <main className="home-page">
      <section className="filter-section" aria-label="Filters and Sorting">
        <div className="filter-row">
          <div className="category-filters">
            <span className="filter-label">Categories:</span>
            <div className="category-chips" role="group" aria-label="Category filters">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`chip ${selectedCats.includes(cat.id) ? "chip-active" : ""}`}
                  onClick={() => toggleCategory(cat.id)}
                  aria-pressed={selectedCats.includes(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="sort-row">
            <label htmlFor="sort-select" className="filter-label">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSort(e.target.value as SortOption)}
              className="sort-select"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
            </select>

            {(selectedCats.length > 0 || sortBy !== "default") && (
              <button className="clear-btn" onClick={clearFilters}>
                Clear All
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="products-section" aria-label="Products">
        <div className="products-header">
          <h2>
            {selectedCats.length > 0
              ? `${selectedCats.length} categor${selectedCats.length > 1 ? "ies" : "y"} selected`
              : "All Products"}
          </h2>
          {!loading && (
            <span className="results-count">
              {sortedProducts.length} product{sortedProducts.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading ? (
          <div className="loading-grid" aria-live="polite" aria-busy="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card" aria-hidden="true" />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <p className="empty-state" role="status">
            No products found for the selected filters.
          </p>
        ) : (
          <div className="products-grid" role="list">
            {sortedProducts.map((product) => (
              <div key={product.id} role="listitem">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
