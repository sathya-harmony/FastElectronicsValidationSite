import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/lib/cartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PRICING_CONFIG } from "@shared/pricingConfig";

const appleEasing: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: appleEasing }
  },
};

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getSubtotal, getDeliveryBreakdown, getTotal, clearCart } = useCart();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);

  const deliveryBreakdown = getDeliveryBreakdown();

  const pilotSignup = useMutation({
    mutationFn: async (data: { email: string; phone: string }) => {
      const res = await fetch("/api/pilot-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Signup failed");
      return res.json();
    },
    onSuccess: () => {
      setSignupSuccess(true);
      clearCart();
    },
  });

  const handleSignup = () => {
    if (email || phone) {
      pilotSignup.mutate({ email, phone });
    }
  };

  const groupedByStore = items.reduce((acc, item) => {
    if (!acc[item.storeId]) {
      acc[item.storeId] = { storeName: item.storeName, items: [] };
    }
    acc[item.storeId].items.push(item);
    return acc;
  }, {} as Record<number, { storeName: string; items: typeof items }>);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-16">
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: appleEasing }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground/40 mb-6" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Add some products to get started
            </p>
            <Link href="/">
              <motion.span
                className="inline-flex items-center justify-center px-8 h-12 text-base font-medium bg-black text-white rounded-full shadow-lg cursor-pointer"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.98 }}
                data-testid="button-continue-shopping"
              >
                Continue Shopping
              </motion.span>
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
        <div className="max-w-5xl mx-auto px-6">
          <motion.h1 
            className="text-3xl font-bold tracking-tight mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: appleEasing }}
          >
            Shopping Cart
          </motion.h1>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <motion.div 
              className="space-y-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {Object.entries(groupedByStore).map(([storeId, { storeName, items: storeItems }]) => (
                <motion.div key={storeId} variants={fadeInUp}>
                  <Card 
                    className="p-6 rounded-3xl bg-white/80 backdrop-blur-sm border-black/5 premium-shadow" 
                    data-testid={`cart-store-${storeId}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg">{storeName}</h3>
                      <span className="text-sm text-muted-foreground px-3 py-1 bg-secondary rounded-full">
                        Delivery: ₹{PRICING_CONFIG.deliveryFeePerStore}
                      </span>
                    </div>
                    <div className="space-y-5">
                      <AnimatePresence>
                        {storeItems.map((item) => (
                          <motion.div
                            key={item.offerId}
                            className="flex gap-5 items-center"
                            data-testid={`cart-item-${item.offerId}`}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20, height: 0 }}
                            transition={{ duration: 0.3, ease: appleEasing }}
                          >
                            <motion.div 
                              className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden flex-shrink-0"
                              whileHover={{ scale: 1.05 }}
                            >
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                                {item.productName}
                              </h4>
                              <p className="text-base font-bold">
                                ₹{item.price.toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <motion.button
                                className="h-9 w-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors"
                                onClick={() => updateQuantity(item.offerId, item.quantity - 1)}
                                data-testid={`button-decrease-${item.offerId}`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </motion.button>
                              <span className="w-8 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <motion.button
                                className="h-9 w-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors"
                                onClick={() => updateQuantity(item.offerId, item.quantity + 1)}
                                data-testid={`button-increase-${item.offerId}`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </motion.button>
                              <motion.button
                                className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                                onClick={() => removeFromCart(item.offerId)}
                                data-testid={`button-remove-${item.offerId}`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: appleEasing }}
            >
              <Card className="p-6 rounded-3xl bg-white/80 backdrop-blur-sm border-black/5 premium-shadow sticky top-24">
                <h3 className="font-bold text-lg mb-6">Order Summary</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{getSubtotal().toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t border-black/5 pt-4 space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Delivery Charges</span>
                    {deliveryBreakdown.storeDeliveryFees.map((store) => (
                      <div key={store.storeId} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{store.storeName}</span>
                        <span>₹{store.fee}</span>
                      </div>
                    ))}
                    {deliveryBreakdown.transitFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Multi-store transit</span>
                        <span>₹{deliveryBreakdown.transitFee}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-2">
                    <span className="text-muted-foreground">Total Delivery</span>
                    <span className="font-medium">₹{deliveryBreakdown.totalDelivery}</span>
                  </div>
                  
                  <div className="border-t border-black/5 pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{getTotal().toLocaleString()}</span>
                  </div>
                </div>
                <motion.button
                  className="w-full mt-8 rounded-full h-14 text-base font-semibold bg-black text-white shadow-lg shadow-black/20"
                  onClick={() => setShowCheckoutModal(true)}
                  data-testid="button-checkout"
                  whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout
                </motion.button>
                <Link href="/">
                  <motion.span
                    className="block w-full mt-3 text-center text-muted-foreground hover:text-foreground py-3 rounded-full cursor-pointer transition-colors"
                    whileHover={{ scale: 1.02 }}
                    data-testid="button-back-shopping"
                  >
                    Continue Shopping
                  </motion.span>
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={showCheckoutModal} onOpenChange={setShowCheckoutModal}>
        <DialogContent className="sm:max-w-md rounded-3xl border-black/5">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {signupSuccess ? "You're on the list!" : "Coming Soon!"}
            </DialogTitle>
          </DialogHeader>
          
          {signupSuccess ? (
            <motion.div 
              className="text-center py-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              >
                <CheckCircle className="h-20 w-20 mx-auto text-emerald-500 mb-6" />
              </motion.div>
              <p className="text-base text-muted-foreground leading-relaxed">
                Thank you for signing up! Your next order will have <strong className="text-foreground">FREE delivery</strong>. 
                We'll notify you as soon as we launch!
              </p>
              <motion.button
                className="mt-8 rounded-full px-8 h-12 bg-black text-white font-medium"
                onClick={() => {
                  setShowCheckoutModal(false);
                  setSignupSuccess(false);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Browsing
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="pt-2 space-y-5">
                <p className="text-muted-foreground leading-relaxed">
                  We're currently in pilot phase, validating demand before launching our full delivery service in Bangalore.
                </p>
                
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-amber-900">
                    Sign up now and get <strong>FREE delivery</strong> on your first order!
                  </p>
                  <p className="text-sm text-amber-800/80 mt-2 leading-relaxed">
                    Skip the SP Road traffic and long store visits. We'll bring electronics to your doorstep in 30-120 minutes!
                  </p>
                </div>

                <div className="space-y-4">
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl h-12 border-black/10 focus:border-black/20"
                      data-testid="input-email"
                    />
                  </motion.div>
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <Input
                      type="tel"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-xl h-12 border-black/10 focus:border-black/20"
                      data-testid="input-phone"
                    />
                  </motion.div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <motion.button
                  className="flex-1 rounded-full h-12 border border-black/10 font-medium"
                  onClick={() => setShowCheckoutModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Maybe Later
                </motion.button>
                <motion.button
                  className="flex-1 rounded-full h-12 bg-black text-white font-medium shadow-lg disabled:opacity-50"
                  onClick={handleSignup}
                  disabled={!email && !phone}
                  data-testid="button-join-waitlist"
                  whileHover={email || phone ? { scale: 1.02 } : undefined}
                  whileTap={email || phone ? { scale: 0.98 } : undefined}
                >
                  {pilotSignup.isPending ? "Signing up..." : "Get Free Delivery"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
