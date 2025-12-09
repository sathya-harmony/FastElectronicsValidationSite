import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Clock, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/modules/ProductCard";
import type { Product, Store, Offer } from "@shared/schema";

const CATEGORIES = [
  "Microcontrollers",
  "Sensors",
  "Motors",
  "Batteries",
  "Displays",
  "Communication",
  "Power",
  "Accessories"
];

export default function StorePage() {
  const [, params] = useRoute("/store/:id");
  const storeId = params?.id ? parseInt(params.id) : null;

  const { data: stores = [], isLoading: storesLoading } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
    queryFn: async () => {
      const res = await fetch("/api/stores");
      if (!res.ok) throw new Error("Failed to fetch stores");
      return res.json();
    },
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const { data: offers = [], isLoading: offersLoading } = useQuery<Offer[]>({
    queryKey: ["/api/offers"],
    queryFn: async () => {
      const res = await fetch("/api/offers");
      if (!res.ok) throw new Error("Failed to fetch offers");
      return res.json();
    },
  });

  const isLoading = storesLoading || productsLoading || offersLoading;
  const store = stores.find(s => s.id === storeId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Store not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const storeOffers = offers.filter(o => o.storeId === storeId);
  const storeProducts = storeOffers.map(offer => {
    const product = products.find(p => p.id === offer.productId);
    return { product, offer };
  }).filter(item => item.product !== undefined) as { product: Product; offer: Offer }[];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="bg-muted border-b">
        <div className="h-48 md:h-64 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
          
          <div className="container mx-auto px-4 h-full flex items-end pb-8 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="h-24 w-24 md:h-32 md:w-32 bg-white rounded-xl shadow-lg p-2 -mb-12 md:mb-0 border-4 border-background flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{store.name.charAt(0)}</span>
              </div>
              <div className="mb-2 md:mb-0 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{store.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm md:text-base opacity-90">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {store.neighborhood}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {store.deliveryTimeRange} delivery</span>
                  <span className="flex items-center gap-1 text-yellow-400"><Star className="h-4 w-4 fill-current" /> {store.rating} Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 pt-8 md:pt-12 pb-16 flex-1">
        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-transparent border-b rounded-none gap-2">
            <TabsTrigger value="all" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All Products
            </TabsTrigger>
            {CATEGORIES.map(cat => (
              <TabsTrigger key={cat} value={cat} className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {storeProducts.map(({ product, offer }) => (
                <ProductCard key={offer.id} product={product} offer={offer} />
              ))}
            </div>
            {storeProducts.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No products found at this store.
              </div>
            )}
          </TabsContent>
          
          {CATEGORIES.map(cat => (
            <TabsContent key={cat} value={cat} className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {storeProducts
                  .filter(({ product }) => product.category === cat)
                  .map(({ product, offer }) => (
                    <ProductCard key={offer.id} product={product} offer={offer} />
                  ))}
                {storeProducts.filter(({ product }) => product.category === cat).length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No products found in this category at this store.
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
