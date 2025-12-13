import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { LocationPicker } from "@/components/LocationPicker";

interface Coordinates {
    lat: number;
    lng: number;
}

interface LocationContextType {
    userLocation: Coordinates | null;
    setUserLocation: (coords: Coordinates | null) => void;
    requestLocation: () => void;
    calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
    locationPromptOpen: boolean;
    setLocationPromptOpen: (open: boolean) => void;
    error: string | null;
    isLoading: boolean;
    isPickerOpen: boolean;
    setIsPickerOpen: (open: boolean) => void;
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
    const [isLocationPromptOpen, setLocationPromptOpen] = useState(true); // Initial prompt
    const [isPickerOpen, setIsPickerOpen] = useState(false); // Map Picker
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // Bangalore Center (Vidhana Soudha approx)
    const BLR_CENTER = { lat: 12.9716, lng: 77.5946 };

    const handleLocationConfirm = async (coords: Coordinates) => {
        setIsLoading(true);
        const dist = getDistanceFromLatLonInKm(BLR_CENTER.lat, BLR_CENTER.lng, coords.lat, coords.lng);

        // Airport is ~30km from center. Allowing 50km radius to cover Greater Bangalore.
        if (dist > 50) {
            setLocationError(`We don't serve outside Greater Bangalore. Selected location is ${Math.round(dist)}km away.`);
            setIsLoading(false);
            return;
        }

        // Log location to backend
        try {
            await fetch("/api/location", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    lat: coords.lat.toString(),
                    lng: coords.lng.toString(),
                    accuracy: "10.00", // High accuracy from manual pin
                    timestamp: new Date().toISOString()
                })
            });
        } catch (e) {
            console.error("Failed to log location", e);
        }

        setUserLocation(coords);
        setLocationPromptOpen(false); // Close initial prompt if open
        setIsPickerOpen(false); // Close picker
        setLocationError(null);
        setIsLoading(false);
        toast({
            title: "Location Updated",
            description: `Delivery location confirmed (${Math.round(dist)}km from center).`,
        });
    };

    const requestLocation = () => {
        // Instead of getting location immediately, we open the picker.
        // We can optionally try to get current location to center the picker (handled inside Picker)
        setIsPickerOpen(true);
        setLocationPromptOpen(false); // Close the simple prompt
    };

    return (
        <LocationContext.Provider
            value={{
                userLocation,
                setUserLocation,
                requestLocation,
                calculateDistance: getDistanceFromLatLonInKm,
                locationPromptOpen: isLocationPromptOpen,
                setLocationPromptOpen,
                error: locationError,
                isLoading,
                isPickerOpen,
                setIsPickerOpen
            }}
        >
            {children}
            <LocationPicker
                isOpen={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                onConfirm={handleLocationConfirm}
                initialLocation={userLocation}
            />
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
