import { useCart } from "@/lib/cartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

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
    <div 
      className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-black/5 hover:border-black/10 premium-shadow hover:premium-shadow-lg hover-lift" 
      data-testid={`card-product-${product.id}`}
    >
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>
      
      <div className="p-5 space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider mb-1.5">{product.category}</p>
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
        
        <Button
          onClick={handleAddToCart}
          className={`w-full rounded-full h-11 font-medium transition-all duration-300 ${
            justAdded || isInCart
              ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
              : "bg-black hover:bg-gray-800 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/25"
          }`}
          data-testid={`button-add-cart-${product.id}`}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Added!
            </>
          ) : isInCart ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              In Cart
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
