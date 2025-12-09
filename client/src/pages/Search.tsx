import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/modules/ProductCard";

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
  const categories = Array.from(new Set(allProducts.map(p => p.category))).sort();
  
  const getStoreById = (id: number) => stores.find(s => s.id === id);

  const productsWithOffers = displayProducts.map(product => {
    const productOffers = offers.filter(o => o.productId === product.id);
    const bestOffer = productOffers.sort((a, b) => a.price - b.price)[0];
    return { product, offer: bestOffer };
  }).filter(item => item.offer);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="border-b py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-2xl font-semibold">
            {query ? `Results for "${query}"` : "All Products"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {productsWithOffers.length} products available
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

          <div>
            {productsWithOffers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productsWithOffers.map(({ product, offer }) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    offer={offer}
                    storeName={getStoreById(offer.storeId)?.name}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">Try searching for "Arduino", "Sensor", or "ESP32".</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
