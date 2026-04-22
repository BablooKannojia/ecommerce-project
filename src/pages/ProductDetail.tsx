import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../store/cartContext";
import { useEffect, useState } from "react";
import { fetchProductById } from "../services/api";
import type { Product } from "../types";

const getValidImage = (images: string[]): string => {
  const fallback = "https://placehold.co/500x400?text=No+Image";
  if (!images || images.length === 0) return fallback;
  const raw = images[0].replace(/[\[\]"]/g, "");
  try {
    new URL(raw);
    return raw;
  } catch {
    return fallback;
  }
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  console.log("product id", id);
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  console.log("item", items);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);

  const cartItem = items.find((i) => i.id === product?.id);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      setLoading(true);
      setError(false);

      try {
        const data = await fetchProductById(id);
        console.log("product data", data);

        if (!data || !data.id) {
          setError(true);
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error("Error product", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-skeleton" aria-busy="true" aria-label="Loading product" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail-page">
        <p className="error-msg" role="alert">
          Product not found
        </p>
        <button className="btn-outline" onClick={() => navigate("/")}>
          ← Back to Products
        </button>
      </div>
    );
  }

  return (
    <main className="detail-page">
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        ← Back
      </button>

      <div className="detail-card">
        <div className="detail-img-wrap">
          <img
            src={getValidImage(product.images)}
            alt={product.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/500x400?text=No+Image";
            }}
          />
        </div>

        <div className="detail-info">
          <h1>{product.title}</h1>
          <p className="detail-desc">{product.description}</p>

          <div className="detail-price-row">
            <span className="detail-price">₹ {product.price.toFixed(2)}</span>
          </div>

          <div className="detail-actions">
            <button
              className={`btn-primary ${added ? "btn-added" : ""}`}
              onClick={handleAddToCart}
              aria-live="polite"
            >
              {added ? "Added!" : "Add to Cart"}
            </button>
            {cartItem && (
              <button
                className="btn-outline"
                onClick={() => navigate("/cart")}
              >
                View Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
