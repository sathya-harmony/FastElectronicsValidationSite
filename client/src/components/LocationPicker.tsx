import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Loader2, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (location: { lat: number; lng: number }) => void;
    initialLocation?: { lat: number; lng: number } | null;
}

const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem',
};

// Default to Bangalore Center if no initial location
const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };

export function LocationPicker({ isOpen, onClose, onConfirm, initialLocation }: LocationPickerProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number }>(initialLocation || DEFAULT_CENTER);
    const [isGettingCurrent, setIsGettingCurrent] = useState(false);
    const { toast } = useToast();

    // Update selected location when initialLocation changes
    useEffect(() => {
        if (initialLocation) {
            setSelectedLocation(initialLocation);
            map?.panTo(initialLocation);
        }
    }, [initialLocation, map]);

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            setSelectedLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        }
    };

    const handleDragEnd = () => {
        if (map) {
            const center = map.getCenter();
            if (center) {
                // If we want the center to be the selection (like Uber)
                // setSelectedLocation({ lat: center.lat(), lng: center.lng() });
            }
        }
    };

    const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            setSelectedLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        }
    };

    const getCurrentLocation = () => {
        setIsGettingCurrent(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setSelectedLocation(pos);
                    map?.panTo(pos);
                    setIsGettingCurrent(false);
                },
                () => {
                    toast({
                        title: "Error",
                        description: "Could not retrieve your location.",
                        variant: "destructive"
                    });
                    setIsGettingCurrent(false);
                }
            );
        } else {
            setIsGettingCurrent(false);
        }
    };

    const handleConfirm = () => {
        onConfirm(selectedLocation);
        onClose();
    };

    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
        return null; // Should be handled by parent or error boundary, but safe guard here
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Confirm Delivery Location</DialogTitle>
                    <DialogDescription>
                        Drag the pin to your exact building entrance.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative">
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={selectedLocation}
                            zoom={15}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                            onClick={handleMapClick}
                            onDragEnd={handleDragEnd}
                            options={{
                                streetViewControl: false,
                                mapTypeControl: false,
                                fullscreenControl: false,
                            }}
                        >
                            <Marker
                                position={selectedLocation}
                                draggable={true}
                                onDragEnd={handleMarkerDragEnd}
                                animation={google.maps.Animation.DROP}
                            />
                        </GoogleMap>
                    ) : (
                        <div className="h-[400px] w-full bg-muted flex items-center justify-center rounded-lg">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-4 right-4 shadow-md bg-white hover:bg-gray-100 text-black"
                        onClick={getCurrentLocation}
                        disabled={isGettingCurrent}
                    >
                        {isGettingCurrent ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4 mr-2" />}
                        Locate Me
                    </Button>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={onClose} className="sm:w-auto">Cancel</Button>
                    <Button onClick={handleConfirm} className="sm:w-auto bg-black text-white hover:bg-black/90">Confirm Location</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
