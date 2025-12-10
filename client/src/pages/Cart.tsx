import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cartContext";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Store, MapPin, Truck } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { LocationPrompt } from "@/components/modules/LocationPrompt";
import { useLocation } from "@/lib/locationContext";
import { useState } from "react";
import { PaymentModal } from "@/components/modules/PaymentModal";
import { useToast } from "@/hooks/use-toast";
import { analytics } from "@/lib/analytics";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotal, getDeliveryBreakdown, getSubtotal } = useCart();
  const { userLocation, setLocationPromptOpen } = useLocation();
  const { toast } = useToast();

  // New Payment Modal State
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const deliveryBreakdown = getDeliveryBreakdown();

  // Group items by store for display
  const itemsByStore = items.reduce((acc, item) => {
    if (!acc[item.storeId]) {
      acc[item.storeId] = {
        storeName: item.storeName,
        items: []
      };
    }
    acc[item.storeId].items.push(item);
    return acc;
  }, {} as Record<number, { storeName: string; items: typeof items }>);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items before checking out",
        variant: "destructive",
      });
      return;
    }

    // MANDATORY LOCATION CHECK
    if (!userLocation) {
      setLocationPromptOpen(true);
      return;
    }

    analytics.track('checkout_init', {
      cartTotal: getTotal(),
      itemCount: items.length,
      items: items.map(i => ({ id: i.productId, name: i.productName }))
    });

    setPaymentModalOpen(true);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="h-24 w-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
            <Link href="/">
              <Button className="h-12 px-8 rounded-full text-lg">
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold">Cart</span>
          </div>

          <h1 className="text-3xl font-bold mb-8">Shopping Cart ({items.length} items)</h1>

          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {Object.entries(itemsByStore).map(([storeId, storeGroup]) => {
                  const storeFee = deliveryBreakdown.storeDeliveryFees.find(f => f.storeId === Number(storeId))?.fee || 0;

                  return (
                    <motion.div key={storeId} variants={item} className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-black/5">
                        <Store className="h-5 w-5 text-gray-500" />
                        <h3 className="font-semibold text-lg">{storeGroup.storeName}</h3>
                        <div className="ml-auto flex items-center gap-1 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                          <Truck className="h-3 w-3" />
                          <span>Delivery: ₹{storeFee}</span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {storeGroup.items.map((item) => (
                          <div key={item.offerId} className="flex gap-4">
                            <div className="h-24 w-24 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-black/5">
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="h-full w-full object-contain p-2"
                              />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                              <div className="flex justify-between items-start gap-4">
                                <div>
                                  <h4 className="font-medium line-clamp-2">{item.productName}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">₹{Number(item.price).toLocaleString()}</p>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.offerId)}
                                  className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex items-center rounded-lg border border-black/10">
                                  <button
                                    onClick={() => updateQuantity(item.offerId, item.quantity - 1)}
                                    className="p-2 hover:bg-black/5 transition-colors"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.offerId, item.quantity + 1)}
                                    className="p-2 hover:bg-black/5 transition-colors"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                <div className="ml-auto font-semibold">
                                  ₹{(Number(item.price) * item.quantity).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>

            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm sticky top-24 relative">
                {/* Summary content */}
                <h3 className="font-semibold text-xl mb-6">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{getSubtotal().toLocaleString()}</span>
                  </div>

                  {deliveryBreakdown.storeDeliveryFees.map((fee) => (
                    <div key={fee.storeId} className="flex justify-between text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {fee.storeName}
                      </span>
                      <span>₹{fee.fee}</span>
                    </div>
                  ))}

                  <div className="border-t border-dashed my-3"></div>

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{getTotal().toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {!userLocation && (
                    <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-xl mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location needed for final pricing
                    </div>
                  )}

                  <Button
                    className="w-full h-14 text-lg rounded-xl gap-2 font-bold bg-black hover:bg-black/90"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout <ArrowRight className="h-5 w-5" />
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Secure checkout powered by ThunderFast
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <LocationPrompt />
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        totalAmount={getTotal()}
      />
    </div>
  );
}
