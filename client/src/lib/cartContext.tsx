import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PRICING_CONFIG } from "@shared/pricingConfig";
import { useLocation } from "./locationContext";

interface CartItemWithDetails {
  offerId: number;
  productId: number;
  quantity: number;
  productName: string;
  productImage: string;
  price: number;
  storeName: string;
  storeId: number;
}

interface DeliveryBreakdown {
  storeDeliveryFees: { storeId: number; storeName: string; fee: number }[];
  transitFee: number;
  totalDelivery: number;
}

interface CartContextType {
  items: CartItemWithDetails[];
  addToCart: (item: CartItemWithDetails) => void;
  removeFromCart: (offerId: number) => void;
  updateQuantity: (offerId: number, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDeliveryBreakdown: () => DeliveryBreakdown;
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

  const getSubtotal = () =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const { userLocation, calculateDistance } = useLocation();
  const [stores, setStores] = useState<any[]>([]);
  const [pricingMode, setPricingMode] = useState<string>("dynamic");

  useEffect(() => {
    // Fetch stores to get lat/lng
    fetch("/api/stores")
      .then(res => res.json())
      .then(data => setStores(data))
      .catch(err => console.error("Failed to fetch stores", err));

    // Fetch pricing settings
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setPricingMode(data.pricing_mode || "dynamic"))
      .catch(() => setPricingMode("dynamic"));
  }, []);

  const getDeliveryBreakdown = (): DeliveryBreakdown => {
    const uniqueStores = new Map<number, string>();
    items.forEach((item) => {
      if (!uniqueStores.has(item.storeId)) {
        uniqueStores.set(item.storeId, item.storeName);
      }
    });

    const storeDeliveryFees = Array.from(uniqueStores.entries()).map(
      ([storeId, storeName]) => {
        let distance = 5; // Default fallback distance
        const store = stores.find(s => Number(s.id) === Number(storeId));

        if (userLocation && store && store.lat && store.lng) {
          distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            Number(store.lat),
            Number(store.lng)
          );
        } else if (store?.distanceKm) {
          distance = Number(store.distanceKm);
        }

        // Debug log for user visibility
        console.log(`[Delivery] Store: ${storeName}, Dist: ${distance}km, Loc: ${userLocation ? 'Yes' : 'No'}`);

        let fee = Math.round(PRICING_CONFIG.deliveryBaseFee + (PRICING_CONFIG.deliveryPerKmFee * distance));

        if (pricingMode === 'flat_100') fee = 100;
        if (pricingMode === 'flat_150') fee = 150;

        return {
          storeId,
          storeName,
          fee: fee,
        };
      }
    );

    const storeCount = uniqueStores.size;
    // Transit fee logic could be revisited, for now keeping 0 for simplicity or using config
    // The user didn't explicitly ask for transit fee changes, just delivery based on distance.
    const transitFee = 0;

    const totalDelivery =
      storeDeliveryFees.reduce((sum, s) => sum + s.fee, 0) + transitFee;

    return { storeDeliveryFees, transitFee, totalDelivery };
  };

  const getTotal = () => getSubtotal() + getDeliveryBreakdown().totalDelivery;

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
        getSubtotal,
        getDeliveryBreakdown,
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
