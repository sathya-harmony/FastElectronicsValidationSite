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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PRICING_CONFIG } from "@shared/pricingConfig";

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
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some products to get started
            </p>
            <Link href="/">
              <Button data-testid="button-continue-shopping">Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-2xl font-semibold mb-8">Shopping Cart</h1>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(groupedByStore).map(([storeId, { storeName, items }]) => (
                <Card key={storeId} className="p-6 rounded-2xl" data-testid={`cart-store-${storeId}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">{storeName}</h3>
                    <span className="text-sm text-muted-foreground">
                      Delivery: ₹{PRICING_CONFIG.deliveryFeePerStore}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.offerId}
                        className="flex gap-4 items-center"
                        data-testid={`cart-item-${item.offerId}`}
                      >
                        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">
                            {item.productName}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            ₹{item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.offerId, item.quantity - 1)}
                            data-testid={`button-decrease-${item.offerId}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.offerId, item.quantity + 1)}
                            data-testid={`button-increase-${item.offerId}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.offerId)}
                            data-testid={`button-remove-${item.offerId}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 rounded-2xl sticky top-6">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{getSubtotal().toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t pt-3 space-y-2">
                    <span className="text-muted-foreground text-xs font-medium">Delivery Charges</span>
                    {deliveryBreakdown.storeDeliveryFees.map((store) => (
                      <div key={store.storeId} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{store.storeName}</span>
                        <span>₹{store.fee}</span>
                      </div>
                    ))}
                    {deliveryBreakdown.transitFee > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Multi-store transit</span>
                        <span>₹{deliveryBreakdown.transitFee}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-2">
                    <span className="text-muted-foreground">Total Delivery</span>
                    <span>₹{deliveryBreakdown.totalDelivery}</span>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>₹{getTotal().toLocaleString()}</span>
                  </div>
                </div>
                <Button
                  className="w-full mt-6 rounded-full h-12 text-base font-semibold"
                  onClick={() => setShowCheckoutModal(true)}
                  data-testid="button-checkout"
                >
                  Proceed to Checkout
                </Button>
                <Link href="/">
                  <Button
                    variant="ghost"
                    className="w-full mt-2 text-muted-foreground"
                    data-testid="button-back-shopping"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={showCheckoutModal} onOpenChange={setShowCheckoutModal}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {signupSuccess ? "You're on the list!" : "Coming Soon!"}
            </DialogTitle>
          </DialogHeader>
          
          {signupSuccess ? (
            <div className="text-center py-4">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
              <p className="text-base text-muted-foreground">
                Thank you for signing up! Your next order will have <strong>FREE delivery</strong>. 
                We'll notify you as soon as we launch!
              </p>
              <Button
                className="mt-6 rounded-full"
                onClick={() => {
                  setShowCheckoutModal(false);
                  setSignupSuccess(false);
                }}
              >
                Continue Browsing
              </Button>
            </div>
          ) : (
            <>
              <div className="pt-2 space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We're currently in pilot phase, validating demand before launching our full delivery service in Bangalore.
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-amber-800">
                    Sign up now and get <strong>FREE delivery</strong> on your first order!
                  </p>
                  <p className="text-xs text-amber-700 mt-2">
                    Skip the SP Road traffic and long store visits. We'll bring electronics to your doorstep in 30-120 minutes - no more wasting hours navigating Bangalore traffic!
                  </p>
                </div>

                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl"
                    data-testid="input-email"
                  />
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl"
                    data-testid="input-phone"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full"
                  onClick={() => setShowCheckoutModal(false)}
                >
                  Maybe Later
                </Button>
                <Button
                  className="flex-1 rounded-full"
                  onClick={handleSignup}
                  disabled={!email && !phone}
                  data-testid="button-join-waitlist"
                >
                  {pilotSignup.isPending ? "Signing up..." : "Get Free Delivery"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
