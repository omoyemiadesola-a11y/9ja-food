import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../services/api';

export default function CartPage() {
  const { cartItems, total, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!cartItems.length) return;

    setSubmitting(true);
    try {
      await createOrder({
        userId: user.id,
        items: cartItems,
        total,
      });
      clearCart();
      setMessage('Order placed successfully.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container section split-layout">
      <section>
        <h1>Your Cart</h1>
        {!cartItems.length && <p>No items yet. Add meals from menu.</p>}
        <div className="stack mt-sm">
          {cartItems.map((item) => (
            <article key={item.id} className="card row-between">
              <div>
                <h3>{item.name}</h3>
                <p>₦{Number(item.price).toLocaleString()}</p>
              </div>
              <div className="qty-controls">
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="card">
        <h2>Checkout</h2>
        <p>Total: <strong className="price">₦{Number(total).toLocaleString()}</strong></p>
        <button className="btn btn-primary w-full mt-sm" onClick={handleCheckout} disabled={submitting} type="button">
          {submitting ? 'Placing...' : 'Place Order'}
        </button>
        {message && <p className="mt-sm">{message}</p>}
      </aside>
    </div>
  );
}
