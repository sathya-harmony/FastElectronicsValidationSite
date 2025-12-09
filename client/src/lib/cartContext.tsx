import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItemWithDetails {
  offerId: number;
  quantity: number;
  productName: string;
  productImage: string;
  price: number;
  storeName: string;
  storeId: number;
}

interface CartContextType {
  items: CartItemWithDetails[];
  addToCart: (item: CartItemWithDetails) => void;
  removeFromCart: (offerId: number) => void;
  updateQuantity: (offerId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemWithDetails[]>(() => {
    const saved = localStorage.getItem("thunderfast-cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("thunderfast-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItemWithDetails) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.offerId === item.offerId);
      if (existing) {
        return prev.map((i) =>
          i.offerId === item.offerId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (offerId: number) => {
    setItems((prev) => prev.filter((i) => i.offerId !== offerId));
  };

  const updateQuantity = (offerId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(offerId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.offerId === offerId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const getTotal = () =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getItemCount = () =>
    items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
