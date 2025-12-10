import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Check, Star, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cartContext";

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        id: number | string;
        name: string;
        category: string;
        shortDesc: string;
        longDescription?: string | null;
        image: string;
        specs: string[];
    };
    offer: {
        id: number | string;
        price: number;
        displayedDeliveryFee: number;
        eta: number;
        stock: number;
        storeId: number | string;
    };
    storeName: string;
}

export function ProductDetailsModal({ isOpen, onClose, product, offer, storeName }: ProductDetailsModalProps) {
    const { addToCart } = useCart();
    const [justAdded, setJustAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart({
            offerId: Number(offer.id),
            quantity: 1,
            productName: product.name,
            productImage: product.image,
            price: offer.price,
            storeName: storeName,
            storeId: Number(offer.storeId),
        });
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1500);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-none shadow-2xl sm:rounded-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 h-[80vh] md:h-[600px]">
                    {/* Image Section */}
                    <div className="relative bg-gray-50 flex items-center justify-center p-8 group overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        />
                        <motion.img
                            src={product.image}
                            alt={product.name}
                            className="relative w-full h-full object-contain mix-blend-multiply z-10"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            layoutId={`product-image-${product.id}`}
                        />

                        {/* Floating Tags */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                            <span className="px-3 py-1 bg-white/80 backdrop-blur text-xs font-semibold rounded-full shadow-sm">
                                {product.category}
                            </span>
                            {offer.stock < 10 && (
                                <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full shadow-sm">
                                    Only {offer.stock} left
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col h-full bg-white">
                        <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold leading-tight mb-2">{product.name}</h2>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                            <Truck className="h-4 w-4" /> {offer.eta} min delivery
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <ShieldCheck className="h-4 w-4" /> Warranty
                                        </span>
                                    </div>
                                </div>
                                {/* Close button provided by Dialog primitive, but we can add a custom one if needed */}
                            </div>

                            <div className="flex items-baseline gap-3 mb-6">
                                <span className="text-3xl font-bold">₹{offer.price.toLocaleString()}</span>
                                {offer.displayedDeliveryFee > 0 ? (
                                    <span className="text-sm text-muted-foreground">+ ₹{offer.displayedDeliveryFee} delivery</span>
                                ) : (
                                    <span className="text-sm text-emerald-600 font-medium">Free Delivery</span>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-2">Description</h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        {product.longDescription || product.shortDesc}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Specifications</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {product.specs && product.specs.length > 0 ? (
                                            product.specs.map((spec, i) => (
                                                <div key={i} className="flex items-start justify-between py-2 border-b border-gray-100 text-sm">
                                                    <span className="font-medium text-gray-900">{spec.split(':')[0]}</span>
                                                    <span className="text-muted-foreground text-right">{spec.split(':')[1] || ''}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">No specifications available</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <div className="p-6 border-t bg-gray-50/50 backdrop-blur-sm">
                            <motion.button
                                onClick={handleAddToCart}
                                className={`w-full h-12 rounded-xl font-medium flex items-center justify-center gap-2 text-lg shadow-lg transition-all ${justAdded
                                        ? "bg-emerald-600 text-white shadow-emerald-500/25"
                                        : "bg-black text-white shadow-black/25 hover:shadow-black/40 hover:-translate-y-0.5"
                                    }`}
                                whileTap={{ scale: 0.98 }}
                            >
                                <AnimatePresence mode="wait">
                                    {justAdded ? (
                                        <motion.span
                                            key="added"
                                            className="flex items-center gap-2"
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -10, opacity: 0 }}
                                        >
                                            <Check className="h-5 w-5" /> Added to Cart
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="add"
                                            className="flex items-center gap-2"
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -10, opacity: 0 }}
                                        >
                                            <ShoppingCart className="h-5 w-5" /> Add to Cart - ₹{offer.price.toLocaleString()}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
