import { useState } from "react";
import { PilotModal } from "./PilotModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="group cursor-pointer" data-testid={`card-product-${product.id}`}>
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{product.category}</p>
          <h3 className="font-medium text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {product.shortDesc}
          </p>
          
          <div className="pt-2 flex items-center justify-between">
            <div>
              <span className="font-semibold text-base">₹{offer.price.toLocaleString()}</span>
              {offer.displayedDeliveryFee > 0 && (
                <span className="text-xs text-muted-foreground ml-2">
                  +₹{offer.displayedDeliveryFee} delivery
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">
              {storeName || 'Store'} · {offer.eta} min
            </span>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-medium text-foreground hover:underline"
              data-testid={`button-buy-${product.id}`}
            >
              Buy
            </button>
          </div>
        </div>
      </div>
      
      <PilotModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productName={product.name}
      />
    </>
  );
}
