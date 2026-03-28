import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchMyOrders } from '../services/api';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      const data = await fetchMyOrders(user.id);
      setOrders(data);
      setLoading(false);
    };

    run();
  }, [user]);

  if (loading) return <div className="container section">Loading orders...</div>;

  return (
    <div className="container section">
      <h1>My Orders</h1>
      <div className="stack mt-sm">
        {orders.map((order) => (
          <article key={order.id} className="card">
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ₦{Number(order.total).toLocaleString()}</p>
            <details>
              <summary>Items</summary>
              <pre>{JSON.stringify(order.items, null, 2)}</pre>
            </details>
          </article>
        ))}
        {!orders.length && <p>No orders yet.</p>}
      </div>
    </div>
  );
}
