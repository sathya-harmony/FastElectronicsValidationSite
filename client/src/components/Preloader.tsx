import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IMAGES } from "@shared/images";

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [progress, setProgress] = useState(0);
    const [loadedCount, setLoadedCount] = useState(0);

    useEffect(() => {
        const imageUrls = Object.values(IMAGES);
        const total = imageUrls.length;

        // Safety check: if no images, complete immediately
        if (total === 0) {
            setProgress(100);
            setTimeout(onComplete, 500);
            return;
        }

        const loadImages = async () => {
            const promises = imageUrls.map((src) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    img.src = src;
                    // Whether success or error, we count it as "processed" to not block the UI
                    img.onload = () => resolve();
                    img.onerror = () => resolve();
                });
            });

            // Update progress as each promise resolves
            promises.forEach((p) => {
                p.then(() => {
                    setLoadedCount((prev) => {
                        const newCount = prev + 1;
                        setProgress(Math.round((newCount / total) * 100));
                        return newCount;
                    });
                });
            });

            await Promise.all(promises);

            // Ensure we hit 100% and wait a tiny bit for the animation to finish
            setProgress(100);
            setTimeout(onComplete, 800);
        };

        loadImages();
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
                    {/* Logo or Icon could go here */}
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
                    <span>Loading assets...</span>
                    <span>{progress}%</span>
                </div>
            </motion.div>
        </div>
    );
}
