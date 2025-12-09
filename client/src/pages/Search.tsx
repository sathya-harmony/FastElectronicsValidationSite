import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/modules/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { X, SlidersHorizontal } from "lucide-react";

const appleEasing: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: appleEasing }
  },
};

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

function fuzzyMatch(text: string, query: string): number {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const terms = lowerQuery.split(/\s+/).filter(t => t.length > 0);
  
  if (terms.length === 0) return 0;
  
  let score = 0;
  for (const term of terms) {
    if (lowerText.includes(term)) {
      score += term.length * 2;
      if (lowerText.startsWith(term)) score += 5;
      if (lowerText === term) score += 10;
    } else {
      let partial = 0;
      for (let i = 0; i < term.length - 1; i++) {
        if (lowerText.includes(term.slice(i, i + 2))) {
          partial += 1;
        }
      }
      score += partial * 0.5;
    }
  }
  
  return score;
}

export default function SearchPage() {
  const [location] = useLocation();
  const query = new URLSearchParams(location.split('?')[1]).get('q') || '';
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<number | null>(null);

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

  const categories = useMemo(() => 
    Array.from(new Set(allProducts.map(p => p.category))).sort()
  , [allProducts]);
  
  const getStoreById = (id: number) => stores.find(s => s.id === id);

  const filteredProducts = useMemo(() => {
    let products = allProducts;
    
    if (selectedCategory) {
      products = products.filter(p => p.category === selectedCategory);
    }
    
    if (query.trim()) {
      const scored = products.map(product => {
        const nameScore = fuzzyMatch(product.name, query) * 3;
        const categoryScore = fuzzyMatch(product.category, query) * 2;
        const skuScore = fuzzyMatch(product.sku, query) * 2;
        const descScore = fuzzyMatch(product.shortDesc || "", query);
        const specScore = (product.specs || []).reduce((acc, spec) => acc + fuzzyMatch(spec, query), 0);
        
        return {
          product,
          score: nameScore + categoryScore + skuScore + descScore + specScore
        };
      });
      
      products = scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.product);
    }
    
    return products;
  }, [allProducts, query, selectedCategory]);

  const productsWithOffers = useMemo(() => {
    let items = filteredProducts.map(product => {
      let productOffers = offers.filter(o => o.productId === product.id);
      
      if (selectedStore) {
        productOffers = productOffers.filter(o => o.storeId === selectedStore);
      }
      
      const bestOffer = productOffers.sort((a, b) => a.price - b.price)[0];
      return { product, offer: bestOffer };
    }).filter(item => item.offer);
    
    return items;
  }, [filteredProducts, offers, selectedStore]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedStore(null);
  };

  const hasFilters = selectedCategory || selectedStore;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <motion.div 
        className="border-b border-black/5 pt-24 pb-10 bg-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: appleEasing }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.h1 
            className="text-3xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: appleEasing }}
          >
            {query ? `Results for "${query}"` : "All Products"}
          </motion.h1>
          <motion.p 
            className="text-muted-foreground mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {productsWithOffers.length} products available
          </motion.p>
          
          <AnimatePresence>
            {hasFilters && (
              <motion.div 
                className="flex items-center gap-3 mt-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters:
                </span>
                {selectedCategory && (
                  <motion.button
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-sm rounded-full"
                    onClick={() => setSelectedCategory(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {selectedCategory}
                    <X className="h-3.5 w-3.5" />
                  </motion.button>
                )}
                {selectedStore && (
                  <motion.button
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-sm rounded-full"
                    onClick={() => setSelectedStore(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {getStoreById(selectedStore)?.name}
                    <X className="h-3.5 w-3.5" />
                  </motion.button>
                )}
                <motion.button
                  className="text-sm text-muted-foreground hover:text-foreground underline ml-2"
                  onClick={clearFilters}
                  whileHover={{ scale: 1.02 }}
                >
                  Clear all
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-16">
          
          <motion.aside 
            className="hidden lg:block space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: appleEasing }}
          >
            <div>
              <h3 className="font-semibold text-sm mb-5">Categories</h3>
              <div className="space-y-1">
                {categories.map((cat, i) => (
                  <motion.button 
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                      selectedCategory === cat 
                        ? "bg-black text-white font-medium" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.02 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid={`filter-category-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>
            
            <Separator className="bg-black/5" />
            
            <div>
              <h3 className="font-semibold text-sm mb-5">Stores</h3>
              <div className="space-y-1">
                {stores.map((store, i) => (
                  <motion.button 
                    key={store.id}
                    onClick={() => setSelectedStore(selectedStore === store.id ? null : store.id)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                      selectedStore === store.id 
                        ? "bg-black text-white font-medium" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.02 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid={`filter-store-${store.id}`}
                  >
                    {store.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.aside>

          <div>
            <AnimatePresence mode="wait">
              {productsWithOffers.length > 0 ? (
                <motion.div 
                  key="products"
                  className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {productsWithOffers.map(({ product, offer }) => (
                    <motion.div 
                      key={product.id}
                      variants={staggerItem}
                      layout
                    >
                      <ProductCard 
                        product={product} 
                        offer={offer}
                        storeName={getStoreById(offer.storeId)?.name || "Store"}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  className="text-center py-24"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <h3 className="text-xl font-semibold mb-3">No results found</h3>
                    <p className="text-muted-foreground mb-6">
                      {query 
                        ? `We couldn't find anything matching "${query}".`
                        : "No products match your current filters."}
                    </p>
                    {hasFilters && (
                      <motion.button
                        onClick={clearFilters}
                        className="px-6 py-3 bg-black text-white rounded-full font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Clear Filters
                      </motion.button>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
