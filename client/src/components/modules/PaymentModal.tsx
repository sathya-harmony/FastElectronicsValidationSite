import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, CreditCard, Smartphone, Banknote, ArrowRight, Loader2, Sparkles, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cartContext";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";

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
    const [step, setStep] = useState<"select" | "processing" | "signup" | "success">("select");
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

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
            setStep("success");
            clearCart();
        },
    });

    const handlePaymentSelect = async (methodId: string) => {
        setSelectedMethod(methodId);

        // Track event
        try {
            await fetch("/api/track-event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventType: "payment_option_selected",
                    searchQuery: methodId
                }),
            });
        } catch (e) {
            console.error("Tracking failed", e);
        }

        setStep("processing");

        // Simulate processing delay then move to signup
        setTimeout(() => {
            setStep("signup");
        }, 2000);
    };

    const handleSignup = () => {
        if (email || phone) {
            pilotSignup.mutate({ email, phone });
        }
    };

    const handleClose = () => {
        if (step === "success") {
            setStep("select");
            setSelectedMethod(null);
            setEmail("");
            setPhone("");
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

                    {step === "signup" && (
                        <motion.div
                            key="signup"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="p-8 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 animate-shimmer" />

                            <DialogHeader className="mb-8">
                                <motion.div
                                    initial={{ rotate: -10, scale: 0 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{ type: "spring", delay: 0.2 }}
                                    className="mx-auto w-16 h-16 bg-gradient-to-tr from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner"
                                >
                                    <Sparkles className="h-8 w-8 text-amber-600" />
                                </motion.div>
                                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                    Priority Access Unlocked
                                </DialogTitle>
                                <p className="text-muted-foreground mt-2 leading-relaxed">
                                    You're clearly serious about electronics. We're currently in an exclusive pilot phase.
                                </p>
                            </DialogHeader>

                            <div className="space-y-4 mb-6 text-left">
                                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
                                    <p className="text-sm text-emerald-800 font-medium text-center">
                                        Join now for <span className="font-bold underline">Lifetime Free Delivery</span> on pilot orders!
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            type="email"
                                            placeholder="Email Address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            type="tel"
                                            placeholder="Phone Number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                className="w-full h-12 bg-black text-white font-bold rounded-xl shadow-lg shadow-black/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSignup}
                                disabled={(!email && !phone) || pilotSignup.isPending}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {pilotSignup.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" /> Securing Spot...
                                    </>
                                ) : (
                                    <>
                                        Claim Priority Access <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </motion.button>

                            <button
                                onClick={() => setStep("success")}
                                className="mt-4 text-xs text-muted-foreground hover:text-black underline transition-colors"
                                disabled={pilotSignup.isPending}
                            >
                                Skip offer, complete order simulation
                            </button>
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
