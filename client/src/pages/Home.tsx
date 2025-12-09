import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/modules/Hero";
import { ProductCard } from "@/components/modules/ProductCard";
import { useQuery } from "@tanstack/react-query";

interface Product {
  id: number;
  name: string;
  category: string;
  shortDesc: string;
  image: string;
  specs: string[];
}

interface Store {
  id: number;
  name: string;
  neighborhood: string;
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

export default function Home() {
  const { data: products = [] } = useQuery<Product[]>({
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

  const getStoreById = (id: number) => stores.find(s => s.id === id);

  const productsWithOffers = products.slice(0, 8).map(product => {
    const productOffers = offers.filter(o => o.productId === product.id);
    const bestOffer = productOffers.sort((a, b) => a.price - b.price)[0];
    return { product, offer: bestOffer };
  }).filter(item => item.offer);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero />
        
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-semibold tracking-tight mb-8">Products</h2>
            
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
              <div className="text-center py-12 text-muted-foreground">
                <p>No products available yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
