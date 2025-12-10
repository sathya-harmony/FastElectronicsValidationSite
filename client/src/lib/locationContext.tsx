import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface Coordinates {
    lat: number;
    lng: number;
}

interface LocationContextType {
    userLocation: Coordinates | null;
    setUserLocation: (coords: Coordinates | null) => void;
    requestLocation: () => Promise<void>;
    calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
    locationPromptOpen: boolean; // Alias for isLocationPromptOpen for consistency
    setLocationPromptOpen: (open: boolean) => void;
    error: string | null; // Alias for locationError
    isLoading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Haversine formula to calculate distance in km
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return Number(d.toFixed(1));
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export function LocationProvider({ children }: { children: ReactNode }) {
    const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
    const [isLocationPromptOpen, setLocationPromptOpen] = useState(true); // Open by default on load
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const requestLocation = async () => {
        setIsLoading(true);
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            setIsLoading(false);
            return;
        }

        try {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setLocationPromptOpen(false);
                    setLocationError(null);
                    setIsLoading(false);
                    toast({
                        title: "Location detected",
                        description: "Delivery fees updated for your location.",
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    let errorMsg = "Unable to retrieve your location";
                    if (error.code === error.PERMISSION_DENIED) {
                        errorMsg = "Location permission denied. Using default location.";
                    }
                    setLocationError(errorMsg);
                    setIsLoading(false);
                    // Fallback to a central Bangalore location or keep null
                    // Keeping null allows us to show "Calculate Delivery" state
                }
            );
        } catch (err) {
            console.error(err);
            setLocationError("An existing location request is already in progress.");
            setIsLoading(false);
        }
    };

    return (
        <LocationContext.Provider
            value={{
                userLocation,
                setUserLocation,
                requestLocation,
                calculateDistance: getDistanceFromLatLonInKm,
                locationPromptOpen: isLocationPromptOpen, // Aliased
                setLocationPromptOpen,
                error: locationError, // Aliased
                isLoading,
            }}
        >
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error("useLocation must be used within a LocationProvider");
    }
    return context;
}
