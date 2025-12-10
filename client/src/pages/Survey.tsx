import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SurveyPage() {
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState<any>({});

    const handleOption = (key: string, value: string) => {
        setAnswers({ ...answers, [key]: value });
        if (step < 2) {
            setStep(step + 1);
        } else {
            // Submit
            toast({
                title: "Feedback Received",
                description: "Thank you for helping us build the future of electronics!",
            });
            setStep(3); // Completion state
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg"
                >
                    <Card className="border-black/5 premium-shadow">
                        {step === 3 ? (
                            <div className="p-8 text-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                                >
                                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                                </motion.div>
                                <h2 className="text-2xl font-bold">You're on the list!</h2>
                                <p className="text-muted-foreground">
                                    We'll notify you as soon as ThunderFast launches in your area with 60-min delivery.
                                </p>
                                <Link href="/">
                                    <Button className="w-full h-12 rounded-full mt-4">Return to Store</Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold uppercase tracking-wider">
                                            Quick Survey
                                        </span>
                                        <span className="text-muted-foreground text-sm">Step {step} of 2</span>
                                    </div>
                                    <CardTitle className="text-2xl">
                                        {step === 1 ? "What brought you here today?" : "How urgent is this project?"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {step === 1 && (
                                        <div className="grid gap-3">
                                            {[
                                                "I have an immediate project deadline.",
                                                "I'm blocked by a missing component.",
                                                "Just browsing for future projects.",
                                                "Testing if this service is real."
                                            ].map((opt) => (
                                                <Button
                                                    key={opt}
                                                    variant="outline"
                                                    className="h-auto py-4 justify-start text-left text-base rounded-xl hover:border-black/30 hover:bg-secondary/50"
                                                    onClick={() => handleOption("motivation", opt)}
                                                >
                                                    {opt}
                                                </Button>
                                            ))}
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="grid gap-3">
                                            {[
                                                "Critical (Need it within hours)",
                                                "High (Need it today)",
                                                "Moderate (Tomorrow is fine)",
                                                "Low (Whenever it arrives)"
                                            ].map((opt) => (
                                                <Button
                                                    key={opt}
                                                    variant="outline"
                                                    className="h-auto py-4 justify-start text-left text-base rounded-xl hover:border-black/30 hover:bg-secondary/50"
                                                    onClick={() => handleOption("urgency", opt)}
                                                >
                                                    {opt}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </>
                        )}
                    </Card>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
