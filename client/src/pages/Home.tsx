import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/modules/Hero";
import { ProductCard } from "@/components/modules/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, Star, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero />
        
        {/* Partner Stores Section */}
        <section className="py-16 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-semibold tracking-tight mb-8">Partner Stores</h2>
            
            {stores.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map((store) => (
                  <Link key={store.id} href={`/store/${store.id}`}>
                    <Card 
                      className="group h-full overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-transparent hover:border-primary/20 bg-white cursor-pointer"
                      data-testid={`card-store-${store.id}`}
                    >
                      <CardHeader className="p-0">
                        <div className="h-32 bg-muted relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
                          <img 
                            src={store.logo} 
                            alt={store.name} 
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-background p-1 shadow-md">
                              <img src={store.logo} alt="logo" className="w-full h-full object-contain rounded-md" />
                            </div>
                            <div className="text-white">
                              <h3 className="font-bold text-lg leading-tight">{store.name}</h3>
                              <div className="flex items-center gap-1 text-xs opacity-90">
                                <MapPin className="h-3 w-3" /> {store.neighborhood}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <Badge variant="secondary" className="font-normal flex gap-1 items-center">
                            <Clock className="h-3 w-3" /> {store.deliveryTimeRange}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            {store.rating}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {store.description}
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm">
                        <span className="font-medium text-muted-foreground">{store.priceLevel} Pricing</span>
                        <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform">Visit Store →</span>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No stores available yet.</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Products Section */}
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
