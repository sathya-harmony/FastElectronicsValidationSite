import { storage } from "./server/storage";

async function main() {
    console.log("Cleaning database...");

    try {
        // Delete in order to respect foreign key constraints

        // 1. Offers depend on Products and Stores
        await storage.deleteAllOffers();
        console.log("Deleted all offers");

        // 2. Products and Stores
        await storage.deleteAllProducts();
        console.log("Deleted all products");

        await storage.deleteAllStores();
        console.log("Deleted all stores");

        console.log("Database cleanup successful!");
    } catch (e) {
        console.error("Error cleaning database:", e);
        process.exit(1);
    }
}

main().catch(console.error);
