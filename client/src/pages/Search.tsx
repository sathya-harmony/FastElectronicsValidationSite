import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { products, offers, stores, categories } from "@/lib/mockData";
import { Zap, Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { PilotModal } from "@/components/modules/PilotModal";

export default function SearchPage() {
  const [location] = useLocation();
  const query = new URLSearchParams(location.split('?')[1]).get('q') || '';
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedModalProduct, setSelectedModalProduct] = useState<string | null>(null);

  // Simple filtering logic
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Header />
      
      {/* Search Header */}
      <div className="bg-background border-b py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Results for "{query}"</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Showing {filteredProducts.length} products available in Bangalore
              </p>
            </div>
            
            <div className="flex gap-2">
               <Button variant="outline" size="sm" className="h-9">
                 <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
               </Button>
               <Button variant="outline" size="sm" className="h-9 md:hidden">
                 <Filter className="mr-2 h-4 w-4" /> Filter
               </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
          
          {/* Filters Sidebar (Desktop) */}
          <aside className="hidden md:block space-y-6">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <Slider 
                    defaultValue={[0, 5000]} 
                    max={10000} 
                    step={100} 
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}+</span>
                  </div>
                </div>

                <Separator />
                
                <div>
                  <label className="text-sm font-medium mb-3 block">Category</label>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <div key={cat} className="flex items-center space-x-2">
                        <Checkbox id={`cat-${cat}`} />
                        <label
                          htmlFor={`cat-${cat}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium mb-3 block">Store</label>
                  <div className="space-y-2">
                    {stores.map(store => (
                      <div key={store.id} className="flex items-center space-x-2">
                        <Checkbox id={`store-${store.id}`} />
                        <label
                          htmlFor={`store-${store.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {store.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results List */}
          <div className="space-y-4">
            {filteredProducts.map(product => {
              // Get offers for this product
              const productOffers = offers.filter(o => o.productId === product.id);
              // Find best price
              const minPrice = Math.min(...productOffers.map(o => o.price));
              
              return (
                <div key={product.id} className="bg-background rounded-xl border p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Info */}
                    <div className="w-full md:w-1/4 flex-shrink-0">
                      <div className="aspect-square bg-white rounded-lg border p-4 flex items-center justify-center mb-3">
                         <img src={product.image} alt={product.name} className="object-contain w-full h-full" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                        <div>
                          <Badge variant="outline" className="mb-2">{product.category}</Badge>
                          <h3 className="text-xl font-bold">{product.name}</h3>
                          <p className="text-muted-foreground text-sm mt-1 mb-3">{product.shortDesc}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {product.specs.map(spec => (
                              <span key={spec} className="px-2 py-1 bg-secondary rounded-md">{spec}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right hidden md:block">
                           <div className="text-xs text-muted-foreground">Starts from</div>
                           <div className="text-2xl font-bold">₹{minPrice}</div>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      {/* Offers List */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Available from {productOffers.length} stores</h4>
                        {productOffers.map(offer => {
                          const store = stores.find(s => s.id === offer.storeId);
                          if (!store) return null;
                          return (
                            <div key={offer.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-white rounded-sm p-0.5 border">
                                  <img src={store.logo} alt={store.name} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                  <div className="font-medium text-sm">{store.name}</div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Zap className="h-3 w-3 text-green-600" fill="currentColor" /> 
                                    ~{offer.eta} mins delivery
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="font-bold">₹{offer.price}</div>
                                <Button size="sm" onClick={() => setSelectedModalProduct(product.name)}>Buy Now</Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredProducts.length === 0 && (
               <div className="text-center py-20">
                 <h3 className="text-lg font-semibold mb-2">No results found</h3>
                 <p className="text-muted-foreground">Try searching for "Arduino", "Sensor", or "Motor".</p>
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
