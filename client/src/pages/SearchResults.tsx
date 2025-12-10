import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/modules/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface Product {
    id: number;
    name: string;
    category: string;
    shortDesc: string;
    image: string;
    specs: string[];
}

interface Offer {
    id: number;
    productId: number;
    storeId: number;
    price: number;
    stock: number;
    displayedDeliveryFee: number;
    eta: number;
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4 }
    },
};

export default function SearchResults() {
    const [location] = useLocation();
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get("q") || "";

    useEffect(() => {
        document.title = query ? `Search: ${query} | Rapid Electronics` : "Search | Rapid Electronics";
    }, [query]);

    const { data: products = [], isLoading } = useQuery<Product[]>({
        queryKey: ["search", query],
        queryFn: async () => {
            // If query is empty, fetch all products
            const endpoint = query
                ? `/api/products/search?q=${encodeURIComponent(query)}`
                : `/api/products`;

            const res = await fetch(endpoint);
            if (!res.ok) throw new Error("Failed to fetch products");
            return res.json();
        },
        // Always enable, so we load all products by default
        enabled: true,
    });

    const { data: offers = [] } = useQuery<Offer[]>({
        queryKey: ["offers"],
        queryFn: async () => {
            const res = await fetch("/api/offers");
            if (!res.ok) throw new Error("Failed to fetch offers");
            return res.json();
        },
    });

    const { data: stores = [] } = useQuery<any[]>({
        queryKey: ["stores"],
        queryFn: async () => {
            const res = await fetch("/api/stores");
            if (!res.ok) throw new Error("Failed to fetch stores");
            return res.json();
        },
    });

    const productsWithOffers = products.map(product => {
        const productOffers = offers.filter(o => o.productId === product.id);
        const bestOffer = productOffers.sort((a, b) => a.price - b.price)[0];
        return { product, offer: bestOffer };
    }).filter(item => item.offer); // Only show products with offers

    const getStoreById = (id: number) => stores.find(s => s.id === id);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-8">
                        <Link href="/">
                            <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary gap-2 mb-4">
                                <ArrowLeft className="h-4 w-4" /> Back to Home
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-secondary rounded-full">
                                <Search className="h-6 w-6 text-foreground" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {query ? "Search Results" : "All Products"}
                                </h1>
                                <p className="text-muted-foreground">
                                    {query ? (
                                        <>Showing results for <span className="font-semibold text-primary">"{query}"</span></>
                                    ) : (
                                        "Browse our complete catalog of components"
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="h-[300px] bg-secondary/50 animate-pulse rounded-2xl" />
                            ))}
                        </div>
                    ) : productsWithOffers.length > 0 ? (
                        <motion.div
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {productsWithOffers.map(({ product, offer }, index) => (
                                <motion.div key={product.id} variants={scaleIn} custom={index}>
                                    <ProductCard
                                        product={product}
                                        offer={offer}
                                        store={getStoreById(offer.storeId)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-black/5">
                            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">No products found</h3>
                            <p className="text-muted-foreground mb-6">
                                We couldn't find anything matching "{query}". Try a different term.
                            </p>
                            <Link href="/">
                                <Button className="rounded-full px-8">Browse All Products</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
