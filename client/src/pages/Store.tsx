import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Clock, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/modules/ProductCard";
import type { Product, Store, Offer } from "@shared/schema";


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
        <div className="flex-1 flex items-center justify-center pt-16">
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
        <div className="flex-1 flex items-center justify-center pt-16">
          <p className="text-muted-foreground text-lg">Store not found</p>
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

  const availableCategories = Array.from(new Set(storeProducts.map(({ product }) => product.category))).sort();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="relative">
        <div className="h-64 md:h-80 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
          
          <div className="max-w-7xl mx-auto px-6 h-full flex items-end pb-10 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 w-full">
              <div className="h-28 w-28 md:h-36 md:w-36 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-3 border-4 border-white/20 flex items-center justify-center -mb-14 md:mb-0">
                <span className="text-4xl font-bold text-gray-900">{store.name.charAt(0)}</span>
              </div>
              <div className="flex-1 text-white pt-16 md:pt-0">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">{store.name}</h1>
                <div className="flex flex-wrap gap-5 text-sm md:text-base">
                  <span className="flex items-center gap-2 text-white/80"><MapPin className="h-4 w-4" /> {store.neighborhood}</span>
                  <span className="flex items-center gap-2 text-white/80"><Clock className="h-4 w-4" /> {store.deliveryTimeRange} delivery</span>
                  <span className="flex items-center gap-2 px-3 py-1 bg-yellow-400/20 rounded-full"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> <span className="text-yellow-400 font-semibold">{store.rating}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16 flex-1">
        <Tabs defaultValue="all" className="space-y-10">
          <TabsList className="w-full justify-start overflow-x-auto h-auto p-1.5 bg-secondary/50 rounded-full gap-1 border border-black/5">
            <TabsTrigger value="all" className="rounded-full px-5 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-foreground transition-all duration-300">
              All Products ({storeProducts.length})
            </TabsTrigger>
            {availableCategories.map(cat => (
              <TabsTrigger key={cat} value={cat} className="rounded-full px-5 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-foreground whitespace-nowrap transition-all duration-300">
                {cat} ({storeProducts.filter(p => p.product.category === cat).length})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {storeProducts.map(({ product, offer }, index) => (
                <div 
                  key={offer.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <ProductCard product={product} offer={offer} storeName={store.name} />
                </div>
              ))}
            </div>
            {storeProducts.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                <p className="text-lg">No products found at this store.</p>
              </div>
            )}
          </TabsContent>
          
          {availableCategories.map(cat => (
            <TabsContent key={cat} value={cat} className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {storeProducts
                  .filter(({ product }) => product.category === cat)
                  .map(({ product, offer }, index) => (
                    <div 
                      key={offer.id} 
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <ProductCard product={product} offer={offer} storeName={store.name} />
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
