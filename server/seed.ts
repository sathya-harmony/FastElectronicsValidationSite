import { storage } from "./storage";
import vishalLogo from '../attached_assets/generated_images/vishal_electronics_logo.png';
import probotLogo from '../attached_assets/generated_images/probot_logo.png';
import robocrazeLogo from '../attached_assets/generated_images/robocraze_logo.png';
import arduinoImage from '../attached_assets/generated_images/arduino_uno_board.png';
import rpiImage from '../attached_assets/generated_images/raspberry_pi_4.png';
import motorImage from '../attached_assets/generated_images/drone_motor.png';

async function seed() {
  console.log("🌱 Seeding database...");

  // Check if stores already exist
  const existingStores = await storage.getAllStores();
  if (existingStores.length > 0) {
    console.log("✅ Database already seeded, skipping...");
    return;
  }

  // Create stores
  const store1 = await storage.createStore({
    name: "Vishal Electronics",
    neighborhood: "Koramangala",
    rating: "4.5",
    deliveryTimeRange: "60-90 min",
    priceLevel: "₹₹",
    logo: vishalLogo,
    description: "Trusted source for components and tools since 2010."
  });

  const store2 = await storage.createStore({
    name: "Probot",
    neighborhood: "Indiranagar",
    rating: "4.8",
    deliveryTimeRange: "45-75 min",
    priceLevel: "₹₹₹",
    logo: probotLogo,
    description: "Specialists in high-end robotics and drone parts."
  });

  const store3 = await storage.createStore({
    name: "Robocraze",
    neighborhood: "HSR Layout",
    rating: "4.2",
    deliveryTimeRange: "70-100 min",
    priceLevel: "₹",
    logo: robocrazeLogo,
    description: "Affordable kits and educational electronics."
  });

  console.log("✅ Created 3 stores");

  // Create products
  const product1 = await storage.createProduct({
    name: "Arduino Uno R3",
    category: "Microcontrollers",
    shortDesc: "The classic microcontroller for all your projects.",
    image: arduinoImage,
    specs: ["ATmega328P", "5V logic", "14 Digital I/O"]
  });

  const product2 = await storage.createProduct({
    name: "Raspberry Pi 4 Model B",
    category: "Single Board Computers",
    shortDesc: "Desktop performance in a tiny credit-card size.",
    image: rpiImage,
    specs: ["4GB RAM", "Quad-core CPU", "Dual 4K support"]
  });

  const product3 = await storage.createProduct({
    name: "920KV Brushless Motor",
    category: "Drone Parts",
    shortDesc: "High efficiency motor for quadcopters.",
    image: motorImage,
    specs: ["920KV", "3-4S LiPo", "Standard Mount"]
  });

  const product4 = await storage.createProduct({
    name: "HC-SR04 Ultrasonic Sensor",
    category: "Sensors",
    shortDesc: "Distance measuring module.",
    image: "https://images.unsplash.com/photo-1555664424-778a69032054?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    specs: ["2cm - 400cm range", "5V operation"]
  });

  const product5 = await storage.createProduct({
    name: "LiPo Battery 2200mAh 3S",
    category: "Power",
    shortDesc: "Reliable power for your drone or RC car.",
    image: "https://images.unsplash.com/photo-1615858039237-77b319d67b2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    specs: ["11.1V", "30C Discharge", "XT60 Connector"]
  });

  console.log("✅ Created 5 products");

  // Create offers
  await storage.createOffer({ productId: product1.id, storeId: store1.id, price: 550, eta: 75, stock: 10 });
  await storage.createOffer({ productId: product1.id, storeId: store2.id, price: 650, eta: 50, stock: 5 });
  await storage.createOffer({ productId: product1.id, storeId: store3.id, price: 480, eta: 95, stock: 20 });

  await storage.createOffer({ productId: product2.id, storeId: store1.id, price: 4500, eta: 80, stock: 2 });
  await storage.createOffer({ productId: product2.id, storeId: store2.id, price: 4800, eta: 45, stock: 8 });

  await storage.createOffer({ productId: product3.id, storeId: store2.id, price: 1200, eta: 55, stock: 12 });
  await storage.createOffer({ productId: product3.id, storeId: store3.id, price: 1100, eta: 90, stock: 4 });

  await storage.createOffer({ productId: product4.id, storeId: store1.id, price: 150, eta: 65, stock: 50 });
  await storage.createOffer({ productId: product4.id, storeId: store3.id, price: 120, eta: 85, stock: 30 });

  await storage.createOffer({ productId: product5.id, storeId: store2.id, price: 1800, eta: 60, stock: 6 });

  console.log("✅ Created 10 offers");
  console.log("🎉 Database seeding complete!");
}

seed().catch(console.error);
