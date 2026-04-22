import { useNavigate } from "react-router-dom";
import { useCart } from "../store/cartContext";

const Cart = () => {
  const {items, removeFromCart, increaseQty, decreaseQty, totalItems} =  useCart();
  console.log("cart", items);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <h1>Your Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button className="btn-primary" onClick={() => navigate("/")}>
            Browse Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-header">
        <h1>Your Cart ({totalItems} item{totalItems !== 1 ? "s" : ""})</h1>
      </div>

      <div className="cart-layout">
        <section className="cart-items" aria-label="Cart items">
          {items.map((item) => (
            <article key={item.id} className="cart-item">
              <img
                src={item.images[0]?.replace(/[\[\]"]/g, "") || 
                   "https://placehold.co/80x80?text=No+Image"}
                alt={item.title}
                className="cart-item-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/80x80?text=No+Image";
                }}
              />
              <div className="cart-item-info">
                <h3 className="cart-item-title">{item.title}</h3>
                <p className="cart-item-unit-price">₹ {item.price.toFixed(2)} each</p>
              </div>
              <div className="cart-item-controls">
                <div className="qty-controls" role="group" aria-label={`Quantity for ${item.title}`}>
                  <button
                    className="qty-btn"
                    onClick={() => decreaseQty(item.id)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="qty-value" aria-label={`Quantity: ${item.quantity}`}>
                    {item.quantity}
                  </span>
                  <button
                    className="qty-btn"
                    onClick={() => increaseQty(item.id)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <p className="cart-item-subtotal">
                  ₹ {(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove from cart"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default Cart;
