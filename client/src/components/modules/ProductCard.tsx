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
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300" 
      data-testid={`card-product-${product.id}`}
    >
      <div className="aspect-square bg-gray-50 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
          <h3 className="font-medium text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-lg">₹{offer.price.toLocaleString()}</span>
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
          className={`w-full rounded-full h-10 font-medium transition-all duration-300 ${
            justAdded || isInCart
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-900 hover:bg-gray-800"
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
