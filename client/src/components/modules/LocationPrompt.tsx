import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { useLocation } from "@/lib/locationContext";
import { useLocation as useRouteLocation } from "wouter";
import { motion } from "framer-motion";
import { analytics } from "@/lib/analytics";
import { useEffect } from "react";

export function LocationPrompt() {
    const {
        userLocation,
        isLoading,
        error,
        requestLocation,
        locationPromptOpen,
        setLocationPromptOpen
    } = useLocation();

    const [loc_path] = useRouteLocation();
    const isCartPage = loc_path === "/cart";

    const handleAllowLocation = () => {
        requestLocation();
        analytics.track('click', { label: 'allow_location_btn', context: 'location_prompt' });
    };

    useEffect(() => {
        if (userLocation) {
            analytics.track('location_shared', {
                lat: userLocation.lat,
                lng: userLocation.lng
            });
        }
    }, [userLocation]);

    useEffect(() => {
        if (error) {
            analytics.track('error', {
                code: 'location_denied',
                message: error
            });
        }
    }, [error]);

    return (
        <Dialog open={locationPromptOpen} onOpenChange={setLocationPromptOpen}>
            <DialogContent className="sm:max-w-md [&>button]:hidden"> {/* Hide defaults close X */}
                <DialogHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 w-fit">
                        <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-2xl">Enable 60-min Delivery</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        We need your location to show available products and accurate delivery times from nearby stores.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 mt-4">
                    <Button
                        className="w-full h-12 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                        onClick={handleAllowLocation}
                        disabled={isLoading}
                    >
                        {isLoading ? "Locating..." : "📍 Share Current Location"}
                    </Button>

                    {!isCartPage && (
                        <Button
                            variant="ghost"
                            className="text-muted-foreground"
                            onClick={() => setLocationPromptOpen(false)}
                        >
                            Enter manually later
                        </Button>
                    )}
                </div>

                <div className="bg-blue-50/50 p-3 rounded-lg text-xs text-center text-blue-800">

                </div>
            </DialogContent>
        </Dialog>
    );
}
