import { storage } from "./server/storage.js";
import { db } from "./server/storage.js";
import { products } from "./shared/schema.js";
import { eq } from "drizzle-orm";

const imageUpdates = {
    "Arduino Uno R3": "https://robu.in/wp-content/uploads/2015/11/SKU-6337-462x550.jpg",
    "Raspberry Pi 4 Model B": "https://robu.in/wp-content/uploads/2020/05/471149Ex11-462x462.jpg",
    "ESP32 WiFi + BT Module": "https://robu.in/wp-content/uploads/2021/05/22-462x462.jpg",
    "SG90 Micro Servo": "https://robu.in/wp-content/uploads/2025/02/1503-1-462x462.jpg",
    "OLED Display 0.96 inch": "https://robu.in/wp-content/uploads/2025/01/10-11-462x462.jpg"
};

async function updateImages() {
    console.log("Starting image updates...");

    // Get all products first to check names
    const allProducts = await storage.getAllProducts();

    for (const product of allProducts) {
        const newImage = imageUpdates[product.name as keyof typeof imageUpdates];
        if (newImage) {
            console.log(`Updating image for ${product.name}...`);
            await db.update(products)
                .set({ image: newImage })
                .where(eq(products.id, product.id));
            console.log(`Updated!`);
        } else {
            console.log(`No new image found for ${product.name}`);
        }
    }

    console.log("All updates complete!");
    process.exit(0);
}

updateImages().catch(err => {
    console.error("Failed to update images:", err);
    process.exit(1);
});
