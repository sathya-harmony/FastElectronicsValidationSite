import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/modules/Hero";
import { StoreCard } from "@/components/modules/StoreCard";
import { stores } from "@/lib/mockData";
import { Search, Package, ShoppingBag, Truck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        
        {/* Stores Section */}
        <section className="py-16 md:py-24 bg-muted/30" id="stores">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Partner Stores in Bangalore</h2>
                <p className="text-muted-foreground max-w-2xl">
                  We've aggregated inventory from the city's best electronics shops. 
                  Browse their catalogs and get instant delivery.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map(store => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-20 bg-background border-t">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-16">How ThunderFast Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent z-0"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="h-24 w-24 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-sm">
                  <Search className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Search & Compare</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Find the exact part you need. Compare prices and ETAs from multiple local stores instantly.
                </p>
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="h-24 w-24 rounded-2xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mb-6 shadow-sm">
                  <Package className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold mb-3">2. Order Instantly</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Place your order. The nearest store confirms stock and packs it immediately.
                </p>
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="h-24 w-24 rounded-2xl bg-orange-100 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center mb-6 shadow-sm">
                  <Truck className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Rapid Delivery</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Our dedicated fleet delivers it to your doorstep in 60-120 minutes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
