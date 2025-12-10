import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/modules/ProductCard";
import { Clock, Star, MapPin, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

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
    lat: number;
    lng: number;
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

export default function StoreDetails() {
    const [, params] = useRoute("/store/:id");
    const storeId = params ? parseInt(params.id) : 0;

    const { data: store, isLoading: storeLoading } = useQuery<Store>({
        queryKey: ["store", storeId],
        queryFn: async () => {
            const res = await fetch(`/api/stores/${storeId}`);
            if (!res.ok) throw new Error("Failed to fetch store");
            return res.json();
        },
        enabled: !!storeId,
    });

    const { data: products = [] } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch("/api/products");
            if (!res.ok) throw new Error("Failed to fetch products");
            return res.json();
        },
    });

    const { data: offers = [] } = useQuery<Offer[]>({
        queryKey: ["offers", storeId],
        queryFn: async () => {
            const res = await fetch(`/api/offers?storeId=${storeId}`);
            if (!res.ok) throw new Error("Failed to fetch offers");
            return res.json();
        },
        enabled: !!storeId,
    });

    if (storeLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!store) {
        return (
            <div className="min-h-screen flex flex-col pt-32 items-center">
                <h1 className="text-2xl font-bold mb-4">Store Not Found</h1>
                <Link href="/">
                    <a className="text-primary hover:underline">Return Home</a>
                </Link>
            </div>
        );
    }

    const storeProducts = products.map(product => {
        const offer = offers.find(o => o.productId === product.id);
        return offer ? { product, offer } : null;
    }).filter((item): item is { product: Product; offer: Offer } => item !== null);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 pb-20">
                {/* Store Hero */}
                <div className="bg-black text-white pt-32 pb-16 px-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-slate-900" />
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <Link href="/">
                            <span className="flex items-center gap-2 text-white/60 hover:text-white mb-8 cursor-pointer transition-colors w-fit">
                                <ArrowLeft className="h-4 w-4" /> Back to Stores
                            </span>
                        </Link>

                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                            <motion.div
                                className="h-32 w-32 rounded-3xl bg-white p-4 shadow-xl shrink-0"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                <img src={store.logo} alt={store.name} className="w-full h-full object-contain" />
                            </motion.div>

                            <div>
                                <motion.h1
                                    className="text-4xl font-bold mb-3"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                >
                                    {store.name}
                                </motion.h1>
                                <motion.div
                                    className="flex flex-wrap items-center gap-4 text-white/80"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-sm backdrop-blur-md">
                                        <MapPin className="h-4 w-4" /> {store.neighborhood}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-sm backdrop-blur-md">
                                        <Clock className="h-4 w-4" /> {store.deliveryTimeRange}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-sm backdrop-blur-md">
                                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> {store.rating}
                                    </span>
                                </motion.div>
                                <motion.p
                                    className="mt-4 text-white/60 max-w-xl text-lg"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {store.description}
                                </motion.p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <h2 className="text-2xl font-bold mb-8">Available Items</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                        {storeProducts.map(({ product, offer }) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                offer={offer}
                                store={store}
                            />
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
