import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/lib/cartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

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
                  <h3 className="font-semibold mb-4 text-lg">{storeName}</h3>
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
                    <span>₹{getTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-green-600">Free</span>
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
            <DialogTitle className="text-xl">Coming Soon!</DialogTitle>
            <DialogDescription className="pt-4 text-base leading-relaxed">
              Thank you for your interest in ThunderFast! We're currently in the pilot phase, 
              validating demand before launching our full delivery service in Bangalore.
              <br /><br />
              Your order has been recorded to help us understand customer preferences. 
              We'll notify you as soon as we launch in your area!
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => setShowCheckoutModal(false)}
            >
              Keep Browsing
            </Button>
            <Button
              className="flex-1 rounded-full"
              onClick={() => {
                clearCart();
                setShowCheckoutModal(false);
              }}
            >
              Join Waitlist
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
