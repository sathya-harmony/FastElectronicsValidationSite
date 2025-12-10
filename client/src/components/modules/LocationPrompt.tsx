import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { useLocation } from "@/lib/locationContext";
import { motion } from "framer-motion";

export function LocationPrompt() {
    const { isLocationPromptOpen, setLocationPromptOpen, requestLocation, userLocation } = useLocation();

    // Don't show if we already have location
    if (userLocation) return null;

    return (
        <Dialog open={isLocationPromptOpen} onOpenChange={setLocationPromptOpen}>
            <DialogContent className="sm:max-w-md border-none shadow-2xl bg-white/95 backdrop-blur-xl">
                <DialogHeader className="text-center items-center">
                    <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <MapPin className="h-8 w-8 text-blue-600" />
                    </div>
                    <DialogTitle className="text-xl font-bold">Set Delivery Location</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        To show you the correct delivery fees and availability, we need to know where you are in Bangalore.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 py-4">
                    <Button
                        className="w-full h-12 text-lg gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 rounded-xl"
                        onClick={requestLocation}
                    >
                        <Navigation className="h-4 w-4" />
                        Use Current Location
                    </Button>

                    <Button
                        variant="ghost"
                        className="text-muted-foreground"
                        onClick={() => setLocationPromptOpen(false)}
                    >
                        Enter manually later
                    </Button>
                </div>

                <div className="bg-blue-50/50 p-3 rounded-lg text-xs text-center text-blue-800">
                    📍 Optimization: 20km delivery ≈ ₹305 (Linear Calculation)
                </div>
            </DialogContent>
        </Dialog>
    );
}
