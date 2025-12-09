import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/modules/Hero";
import { ProductCard } from "@/components/modules/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, Star, MapPin, ArrowRight } from "lucide-react";

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
  logo: string;
  deliveryTimeRange: string;
  rating: number;
  description: string;
  priceLevel: string;
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        
        <section className="py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Partner Stores</h2>
                <p className="text-muted-foreground">Premium electronics from trusted local retailers</p>
              </div>
              <Link 
                href="/search?q=" 
                className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            {stores.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stores.map((store, index) => (
                  <Link key={store.id} href={`/store/${store.id}`}>
                    <div 
                      className="group h-full bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-black/5 hover:border-black/10 premium-shadow hover:premium-shadow-lg hover-lift cursor-pointer animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                      data-testid={`card-store-${store.id}`}
                    >
                      <div className="h-40 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                        <img 
                          src={store.logo} 
                          alt={store.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute bottom-4 left-5 z-20 flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-white/90 backdrop-blur-sm p-2 shadow-xl">
                            <img src={store.logo} alt="logo" className="w-full h-full object-contain rounded-lg" />
                          </div>
                          <div className="text-white">
                            <h3 className="font-bold text-lg leading-tight">{store.name}</h3>
                            <div className="flex items-center gap-1.5 text-sm text-white/80">
                              <MapPin className="h-3.5 w-3.5" /> {store.neighborhood}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-xs font-medium">
                            <Clock className="h-3.5 w-3.5" /> {store.deliveryTimeRange}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm font-semibold">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {store.rating}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {store.description}
                        </p>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-sm text-muted-foreground">{store.priceLevel} Pricing</span>
                          <span className="text-sm font-semibold text-foreground group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                            Visit Store <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p>No stores available yet.</p>
              </div>
            )}
          </div>
        </section>
        
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Products</h2>
                <p className="text-muted-foreground">Curated selection delivered in 30 minutes</p>
              </div>
              <Link 
                href="/search?q=" 
                className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            {productsWithOffers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {productsWithOffers.map(({ product, offer }, index) => (
                  <div 
                    key={product.id} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard 
                      product={product} 
                      offer={offer}
                      storeName={getStoreById(offer.storeId)?.name}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
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
