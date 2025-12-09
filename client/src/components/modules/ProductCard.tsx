import { useCart } from "@/lib/cartContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

const appleEasing: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface ProductCardProps {
  product: {
    id: number | string;
    name: string;
    category: string;
    shortDesc: string;
    image: string;
    specs: string[];
  };
  offer: {
    id: number | string;
    productId: number | string;
    storeId: number | string;
    price: number;
    displayedDeliveryFee: number;
    eta: number;
    stock: number;
  };
  storeName?: string;
}

export function ProductCard({ product, offer, storeName }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  
  const isInCart = items.some(item => item.offerId === Number(offer.id));

  const handleAddToCart = () => {
    addToCart({
      offerId: Number(offer.id),
      quantity: 1,
      productName: product.name,
      productImage: product.image,
      price: offer.price,
      storeName: storeName || "Store",
      storeId: Number(offer.storeId),
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <motion.div 
      className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-black/5 premium-shadow" 
      data-testid={`card-product-${product.id}`}
      whileHover={{ 
        y: -8, 
        boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.2)",
        borderColor: "rgba(0,0,0,0.1)"
      }}
      transition={{ duration: 0.4, ease: appleEasing }}
    >
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <motion.img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.7, ease: appleEasing }}
        />
      </div>
      
      <div className="p-5 space-y-4">
        <div>
          <motion.p 
            className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider mb-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {product.category}
          </motion.p>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-xl tracking-tight">₹{offer.price.toLocaleString()}</span>
          {offer.displayedDeliveryFee > 0 && (
            <span className="text-xs text-muted-foreground">
              +₹{offer.displayedDeliveryFee} delivery
            </span>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground">
          {storeName || "Store"} · {offer.eta} min delivery
        </p>
        
        <motion.button
          onClick={handleAddToCart}
          className={`w-full rounded-full h-11 font-medium flex items-center justify-center gap-2 transition-colors duration-300 ${
            justAdded || isInCart
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
              : "bg-black text-white shadow-lg shadow-black/20"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          data-testid={`button-add-cart-${product.id}`}
        >
          <AnimatePresence mode="wait">
            {justAdded ? (
              <motion.span
                key="added"
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="h-4 w-4" />
                Added!
              </motion.span>
            ) : isInCart ? (
              <motion.span
                key="incart"
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="h-4 w-4" />
                In Cart
              </motion.span>
            ) : (
              <motion.span
                key="add"
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
