import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IMAGES } from "@shared/images";
import { queryClient } from "@/lib/queryClient";

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const imageUrls = Object.values(IMAGES);
        const totalImages = imageUrls.length;
        const apiEndpoints = ["/api/products", "/api/stores", "/api/offers"];
        const totalItems = totalImages + apiEndpoints.length;

        let completedCount = 0;

        const updateProgress = () => {
            completedCount++;
            setProgress(Math.round((completedCount / totalItems) * 100));
        };

        const loadData = async () => {
            // 1. Prefetch API Data (Warms up Vercel Lambdas)
            const apiPromises = apiEndpoints.map(async (endpoint) => {
                const queryKey = [endpoint.replace("/api/", "")]; // e.g. ["products"]
                try {
                    await queryClient.prefetchQuery({
                        queryKey,
                        queryFn: async () => {
                            const res = await fetch(endpoint);
                            if (!res.ok) throw new Error("Failed");
                            return res.json();
                        }
                    });
                } catch (e) {
                    console.error(`Failed to prefetch ${endpoint}`, e);
                } finally {
                    updateProgress();
                }
            });

            // 2. Prefetch Images
            const imagePromises = imageUrls.map((src) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = () => {
                        updateProgress();
                        resolve();
                    };
                    img.onerror = () => {
                        updateProgress(); // Count as done even if failed to avoid hanging
                        resolve();
                    };
                });
            });

            // Wait for everything
            await Promise.all([...apiPromises, ...imagePromises]);

            // Finish
            setProgress(100);
            setTimeout(onComplete, 800);
        };

        loadData();
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-foreground">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm px-8"
            >
                <div className="mb-8 flex justify-center">
                    <div className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">
                        Pilot Store
                    </div>
                </div>

                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <motion.div
                        className="absolute left-0 top-0 h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    />
                </div>

                <div className="mt-4 flex justify-between text-xs font-medium text-muted-foreground font-mono">
                    <span>Initializing store...</span>
                    <span>{progress}%</span>
                </div>
            </motion.div>
        </div>
    );
}
