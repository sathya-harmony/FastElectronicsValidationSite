import { storage } from "./server/storage";
import { type InsertStore, type InsertProduct, type InsertOffer } from "@shared/schema";

async function main() {
    console.log("Seeding database...");

    // clear existing data
    try {
        await storage.deleteAllOffers();
        await storage.deleteAllProducts();
        await storage.deleteAllStores();
    } catch (e) {
        console.log("Tables might be empty or missing, continuing...");
    }

    // Create Store
    const pilotStore: InsertStore = {
        name: "Pilot Store",
        neighborhood: "Tech Hub",
        deliveryTimeRange: "30-45 min",
        priceLevel: "$",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=PS",
        description: "Your go-to spot for electronics prototyping components.",
        distanceKm: "1.2",
        rating: "4.8"
    };

    const store = await storage.createStore(pilotStore);
    console.log("Created store:", store.name);

    // Create Products
    const products: InsertProduct[] = [
        {
            name: "Arduino Uno R3",
            sku: "ARD-UNO-R3",
            category: "Microcontrollers",
            shortDesc: "The classic Arduino board for beginners and pros.",
            image: "https://images.unsplash.com/photo-1608569970220-99c65751f78f?w=800&q=80",
            specs: ["ATmega328P", "14 Digital I/O", "6 Analog Input", "32KB Flash"],
            suitability: "Perfect for beginners learning electronics + coding",
            datasheetUrl: "https://docs.arduino.cc/hardware/uno-rev3"
        },
        {
            name: "Raspberry Pi 4 Model B",
            sku: "RPI-4-8GB",
            category: "Single Board Computers",
            shortDesc: "Desktop performance in a tiny credit-card sized computer.",
            image: "https://images.unsplash.com/photo-1640326075677-bb8968945374?w=800&q=80",
            specs: ["1.5GHz Quad-Core CPU", "8GB RAM", "Dual 4K Display", "Gigabit Ethernet"],
            suitability: "Home server, media center, or retro gaming console",
            datasheetUrl: "https://www.raspberrypi.com/products/raspberry-pi-4-model-b/"
        },
        {
            name: "ESP32 WiFi + BT Module",
            sku: "ESP32-WROOM",
            category: "IoT",
            shortDesc: "Powerful networking capabilities for IoT projects.",
            image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&q=80",
            specs: ["Dual-Core 240MHz", "Wi-Fi + Bluetooth", "Ultra-Low Power", "38 GPIOs"],
            suitability: "Smart home devices and IoT sensors",
            datasheetUrl: "https://www.espressif.com/en/products/socs/esp32"
        },
        {
            name: "SG90 Micro Servo",
            sku: "SERVO-SG90",
            category: "Motors",
            shortDesc: "Tiny and lightweight with high output power.",
            image: "https://images.unsplash.com/photo-1563290740-1a77764d7df6?w=800&q=80",
            specs: ["1.6kg/cm Torque", "0.10s/60deg Speed", "180 degree rotation", "PWM Control"],
            suitability: "Robotic arms, RC aircraft, and small automation",
            datasheetUrl: "#"
        },
        {
            name: "OLED Display 0.96 inch",
            sku: "OLED-096-I2C",
            category: "Displays",
            shortDesc: "Sharp blue/yellow text on black background.",
            image: "https://images.unsplash.com/photo-1555664424-778a690ea370?w=800&q=80",
            specs: ["128x64 pixels", "I2C Interface", "SSD1306 Driver", "3.3V-5V Logic"],
            suitability: "Status indicators and mini-dashboards",
            datasheetUrl: "#"
        }
    ];

    for (const p of products) {
        const product = await storage.createProduct(p);
        console.log("Created product:", product.name);

        // Create Offer for this product
        const offer: InsertOffer = {
            productId: product.id,
            storeId: store.id,
            basePrice: Math.floor(Math.random() * 5000) + 500, // Random price 5.00 - 55.00
            price: Math.floor(Math.random() * 5000) + 500,
            eta: Math.floor(Math.random() * 45) + 15,
            stock: 50,
            displayedDeliveryFee: 150 // $1.50
        };

        await storage.createOffer(offer);
    }

    console.log("Database seeded successfully!");
}

main().catch(console.error);
