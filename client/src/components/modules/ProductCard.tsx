import { Product, Offer, stores } from "@/lib/mockData";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { useState } from "react";
import { PilotModal } from "./PilotModal";

interface ProductCardProps {
  product: Product;
  offer: Offer;
  compact?: boolean;
}

export function ProductCard({ product, offer, compact = false }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const store = stores.find(s => s.id === offer.storeId);

  return (
    <>
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
        <div className="relative aspect-square bg-white p-4 flex items-center justify-center overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {offer.stock < 5 && (
            <Badge variant="destructive" className="absolute top-2 right-2 text-[10px] h-5 px-1.5">
              Only {offer.stock} left
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="text-xs text-muted-foreground mb-1">{product.category}</div>
          <h3 className="font-semibold text-base leading-tight mb-2 line-clamp-2" title={product.name}>
            {product.name}
          </h3>
          
          {!compact && (
            <div className="text-xs text-muted-foreground mb-3 space-y-1">
              {product.specs.slice(0, 2).map((spec, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 bg-muted-foreground/50 rounded-full" /> {spec}
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-auto pt-2 border-t border-dashed">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Sold by {store?.name}</span>
              <span className="flex items-center text-green-600 font-medium">
                <Zap className="h-3 w-3 mr-0.5" fill="currentColor" /> {offer.eta} min
              </span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between gap-3">
          <div className="font-bold text-lg">
            ₹{offer.price}
          </div>
          <Button size="sm" className="rounded-full px-4" onClick={() => setIsModalOpen(true)}>
            Buy Now
          </Button>
        </CardFooter>
      </Card>
      
      <PilotModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productName={product.name}
      />
    </>
  );
}
