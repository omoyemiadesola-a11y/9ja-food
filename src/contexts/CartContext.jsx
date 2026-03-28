import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const value = useMemo(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      cartItems,
      total,
      addToCart(food) {
        setCartItems((prev) => {
          const existing = prev.find((item) => item.id === food.id);
          if (existing) {
            return prev.map((item) =>
              item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item,
            );
          }
          return [...prev, { ...food, quantity: 1 }];
        });
      },
      updateQuantity(id, nextQuantity) {
        setCartItems((prev) =>
          prev
            .map((item) => (item.id === id ? { ...item, quantity: Math.max(nextQuantity, 0) } : item))
            .filter((item) => item.quantity > 0),
        );
      },
      clearCart() {
        setCartItems([]);
      },
    };
  }, [cartItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider.');
  }
  return context;
}
