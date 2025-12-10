import { storage } from "./server/storage.js";
import { products } from "./shared/schema.js";

async function listProducts() {
    try {
        const allProducts = await storage.getAllProducts();
        console.log(`Found ${allProducts.length} products in database.`);
        process.exit(0);
    } catch (error) {
        console.error("Error listing products:", error);
        process.exit(1);
    }
}

listProducts();
