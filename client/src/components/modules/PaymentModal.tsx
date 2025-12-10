import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, CreditCard, Smartphone, Banknote, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cartContext";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
}

const PAYMENT_METHODS = [
    {
        id: "upi",
        name: "UPI / QR",
        icon: Smartphone,
        description: "Google Pay, PhonePe, Paytm",
        color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
        id: "card",
        name: "Credit / Debit Card",
        icon: CreditCard,
        description: "Visa, Mastercard, RuPay",
        color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
        id: "cod",
        name: "Cash on Delivery",
        icon: Banknote,
        description: "Pay heavily upon receipt",
        color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
];

export function PaymentModal({ isOpen, onClose, totalAmount }: PaymentModalProps) {
    const { clearCart } = useCart();
    const [step, setStep] = useState<"select" | "processing" | "success">("select");
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

    const handlePaymentSelect = async (methodId: string) => {
        setSelectedMethod(methodId);

        // Track event
        try {
            await fetch("/api/track-event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventType: "payment_option_selected",
                    searchQuery: methodId // Reusing field for details
                }),
            });
        } catch (e) {
            console.error("Tracking failed", e);
        }

        setStep("processing");

        // Simulate processing delay
        setTimeout(() => {
            setStep("success");
            clearCart();
        }, 2000);
    };

    const handleClose = () => {
        if (step === "success") {
            setStep("select");
            setSelectedMethod(null);
            onClose();
        } else {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl bg-white/95 backdrop-blur-xl p-0 overflow-hidden">
                <AnimatePresence mode="wait">
                    {step === "select" && (
                        <motion.div
                            key="select"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-6"
                        >
                            <DialogHeader className="mb-6">
                                <DialogTitle className="text-2xl font-bold">Checkout</DialogTitle>
                                <p className="text-muted-foreground">
                                    Total Amount: <span className="font-bold text-foreground">₹{totalAmount.toLocaleString()}</span>
                                </p>
                            </DialogHeader>

                            <div className="space-y-3">
                                {PAYMENT_METHODS.map((method) => (
                                    <motion.button
                                        key={method.id}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${method.color} border-transparent hover:border-black/5 hover:shadow-md bg-opacity-50 hover:bg-opacity-100`}
                                        onClick={() => handlePaymentSelect(method.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className={`h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center ${method.color.split(' ')[1]}`}>
                                            <method.icon className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className="font-semibold text-gray-900">{method.name}</h3>
                                            <p className="text-xs text-gray-500">{method.description}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.button>
                                ))}
                            </div>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground bg-gray-50 py-2 rounded-lg">
                                <ShieldCheckIcon className="h-3 w-3" /> Secure SSL Encrypted Transaction
                            </div>
                        </motion.div>
                    )}

                    {step === "processing" && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="p-12 flex flex-col items-center justify-center min-h-[400px]"
                        >
                            <Loader2 className="h-16 w-16 text-black animate-spin mb-6" />
                            <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
                            <p className="text-muted-foreground text-center text-sm">
                                Connecting to secure gateway...
                            </p>
                        </motion.div>
                    )}

                    {step === "success" && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                className="mb-8 relative"
                            >
                                <div className="absolute inset-0 bg-green-100 rounded-full scale-150 opacity-20 animate-pulse" />
                                <CheckCircle className="h-24 w-24 mx-auto text-emerald-500 relative z-10" />
                            </motion.div>

                            <h2 className="text-3xl font-bold mb-4">Order Placed!</h2>
                            <p className="text-muted-foreground mb-8 text-lg">
                                Your order for <span className="font-semibold text-foreground">₹{totalAmount.toLocaleString()}</span> has been confirmed.
                            </p>

                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-8 text-sm text-emerald-800">
                                <p className="font-semibold mb-1">Estimated Delivery</p>
                                <p>Today, within 45 mins</p>
                            </div>

                            <motion.button
                                className="w-full rounded-full h-14 bg-black text-white font-bold text-lg shadow-lg"
                                onClick={handleClose}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Continue Shopping
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}

function ShieldCheckIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
