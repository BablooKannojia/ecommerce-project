import { useNavigate } from "react-router-dom";
import type { Product } from "../types";

interface Props {
  product: Product;
}

const getValidImage = (images: string[]): string => {
  const fallback = "https://placehold.co/300x200?text=No+Image";
  if (!images || images.length === 0) return fallback;
  const raw = images[0].replace(/[\[\]"]/g, "");
  try {
    new URL(raw);
    return raw;
  } catch {
    return fallback;
  }
};

const ProductCard = ({ product }: Props) => {
  const navigate = useNavigate();

  return (
    <main
      className="product-card"
      onClick={() => navigate(`/product/${product.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${product.id}`)}
      aria-label={`${product.title}, ₹${product.price}`}
    >
      <div className="product-card-img-wrap">
        <img
          src={getValidImage(product.images)}
          alt={product.title}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/300x200?text=No+Image";
          }}
        />
      </div>
      <div className="product-card-body">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">₹ {product.price.toFixed(2)}</p>
      </div>
    </main>
  );
};

export default ProductCard;
