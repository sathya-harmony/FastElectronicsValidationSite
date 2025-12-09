import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PilotModal } from "@/components/modules/PilotModal";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  shortDesc: string;
  image: string;
  specs: string[];
}

interface Store {
  id: number;
  name: string;
  neighborhood: string;
  logo: string;
}

interface Offer {
  id: number;
  productId: number;
  storeId: number;
  price: number;
  displayedDeliveryFee: number;
  eta: number;
  stock: number;
}

export default function SearchPage() {
  const [location] = useLocation();
  const query = new URLSearchParams(location.split('?')[1]).get('q') || '';
  const [selectedModalProduct, setSelectedModalProduct] = useState<string | null>(null);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products", "search", query],
    queryFn: async () => {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to search products");
      return res.json();
    },
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const { data: stores = [] } = useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      const res = await fetch("/api/stores");
      if (!res.ok) throw new Error("Failed to fetch stores");
      return res.json();
    },
  });

  const { data: offers = [] } = useQuery<Offer[]>({
    queryKey: ["offers"],
    queryFn: async () => {
      const res = await fetch("/api/offers");
      if (!res.ok) throw new Error("Failed to fetch offers");
      return res.json();
    },
  });

  const displayProducts = query ? products : allProducts;
  const categories = Array.from(new Set(allProducts.map(p => p.category)));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <div className="border-b py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-2xl font-semibold">
            {query ? `Results for "${query}"` : "All Products"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {displayProducts.length} products available
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12">
          
          <aside className="hidden lg:block space-y-6">
            <div>
              <h3 className="font-medium text-sm mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium text-sm mb-4">Stores</h3>
              <div className="space-y-2">
                {stores.map(store => (
                  <button 
                    key={store.id} 
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    {store.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            {displayProducts.map(product => {
              const productOffers = offers.filter(o => o.productId === product.id);
              const minPrice = productOffers.length > 0 
                ? Math.min(...productOffers.map(o => o.price)) 
                : 0;
              
              return (
                <div 
                  key={product.id} 
                  className="border-b pb-6 last:border-b-0"
                  data-testid={`product-row-${product.id}`}
                >
                  <div className="flex gap-6">
                    <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                      <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{product.shortDesc}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {product.specs.slice(0, 4).map((spec, i) => (
                          <span 
                            key={i} 
                            className="text-xs px-2 py-1 bg-gray-100 rounded"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                      
                      {productOffers.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">
                            From {productOffers.length} store{productOffers.length > 1 ? 's' : ''} · Starting ₹{minPrice}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {productOffers.slice(0, 3).map(offer => {
                              const store = stores.find(s => s.id === offer.storeId);
                              return (
                                <button
                                  key={offer.id}
                                  onClick={() => setSelectedModalProduct(product.name)}
                                  className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
                                  data-testid={`button-offer-${offer.id}`}
                                >
                                  <span className="font-medium">₹{offer.price}</span>
                                  <span className="text-muted-foreground">·</span>
                                  <span className="text-muted-foreground">{store?.name}</span>
                                  <span className="text-muted-foreground">·</span>
                                  <span className="text-muted-foreground">{offer.eta} min</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {displayProducts.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">Try searching for "Arduino", "Sensor", or "ESP32".</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <PilotModal 
        isOpen={!!selectedModalProduct} 
        onClose={() => setSelectedModalProduct(null)} 
        productName={selectedModalProduct || ''}
      />
      <Footer />
    </div>
  );
}
