import { storage } from "./server/storage.js";
import { type InsertStore, type InsertProduct, type InsertOffer } from "@shared/schema.js";

const IMAGES: Record<string, string> = {
    "Arduino UNO R3": "/products/arduino-uno-r3.jpg",
    "Breadboard 400 Points": "/products/breadboard-400-points.jpg",
    "Jumper Wires (Set of 40)": "/products/jumper-wires-set-of-40.jpg",
    "HC-SR04 Ultrasonic Sensor": "/products/hc-sr04-ultrasonic-sensor.jpg",
    "DHT11 Temperature & Humidity Sensor": "/products/dht11-temperature-humidity-sensor.jpg",
    "16x2 LCD Display": "/products/16x2-lcd-display.jpg",
    "ESP32 Development Board": "/products/esp32-development-board.jpg",
    "ESP8266 WiFi Module": "/products/esp8266-wifi-module.jpg",
    "Servo Motor SG90": "/products/servo-motor-sg90.jpg",
    "DC Motor (30 RPM)": "/products/dc-motor-30-rpm.jpg",
    "Relay Module 5V (1 Channel)": "/products/relay-module-5v-1-channel.jpg",
    "Motor Driver Module L298N": "/products/motor-driver-module-l298n.jpg",
    "Arduino Nano": "/products/arduino-nano.jpg",
    "Arduino Mega 2560": "/products/arduino-mega-2560.jpg",
    "Gyroscope MPU6050": "/products/gyroscope-mpu6050.jpg",
    "PIR Motion Sensor Module": "/products/pir-motion-sensor-module.jpg",
    "IR Receiver Module": "/products/ir-receiver-module.jpg",
    "Light Sensor (LDR) Module": "/products/light-sensor-ldr-module.jpg",
    "Soil Moisture Sensor": "/products/soil-moisture-sensor.jpg",
    "Flame Sensor Module": "/products/flame-sensor-module.jpg",
    "Sound Sensor Module": "/products/sound-sensor-module.jpg",
    "Gas Sensor MQ-5": "/products/gas-sensor-mq-5.jpg",
    "Bluetooth Module HC-05": "/products/bluetooth-module-hc-05.jpg",
    "SIM800L GSM Module": "/products/sim800l-gsm-module.jpg",
    "Soldering Iron Kit": "/products/soldering-iron-kit.jpg",
    "OLED Display 0.96 Inch": "/products/oled-display-0-96-inch.jpg",
    "LEDs 5mm (Pack of 10)": "/products/leds-5mm-pack-of-10.jpg",
    "Resistor Pack (80 pcs)": "/products/resistor-pack-80-pcs.jpg",
    "Capacitor Pack (Mixed)": "/products/capacitor-pack-mixed.jpg",
    "Buzzer (Active)": "/products/buzzer-active.jpg",
    "Push Button Switch": "/products/push-button-switch.jpg",
    "Diode 1N4007 (Pack of 10)": "/products/diode-1n4007-pack-of-10.jpg",
    "Transistor BC547": "/products/transistor-bc547.jpg",
    "Potentiometer 10K": "/products/potentiometer-10k.jpg",
    "7 Segment Display (1 Digit)": "/products/7-segment-display-1-digit.jpg",
    "Laser Module": "/products/laser-module.jpg",
    "Magnetic Reed Switch": "/products/magnetic-reed-switch.jpg",
    "Hall Effect Sensor": "/products/hall-effect-sensor.jpg",
    "Tilt Switch Module": "/products/tilt-switch-module.jpg",
    "PS2 Game Joystick Module": "/products/ps2-game-joystick-module.jpg",
    "Passive Buzzer Module": "/products/passive-buzzer-module.jpg",
    "LED Traffic Light Module": "/products/led-traffic-light-module.jpg",
    "Stepper Motor NEMA 17": "/products/stepper-motor-nema-17.jpg",
    "Power Supply Module 5V": "/products/power-supply-module-5v.jpg",
    "USB to Serial Converter": "/products/usb-to-serial-converter.jpg",
    "Multimeter (Digital)": "/products/multimeter-digital.jpg",
    "IC 74HC595 Shift Register": "/products/ic-74hc595-shift-register.jpg",
    "10K Sliding Potentiometer": "/products/10k-sliding-potentiometer.jpg",
    "Accelerometer ADXL345": "/products/accelerometer-adxl345.jpg",
    "I2C 16x2 LCD Module": "/products/i2c-16x2-lcd-module.jpg"
};

const ITEMS = [
    ["Arduino UNO R3", "Microcontroller Board", "500-1750", "The classic Arduino board for beginners and pros."],
    ["Breadboard 400 Points", "Prototyping", "45-150", "Essential for building temporary circuits without soldering."],
    ["Jumper Wires (Set of 40)", "Connectors", "30-80", "Colorful wires to connect components on a breadboard."],
    ["LEDs 5mm (Pack of 10)", "Optoelectronics", "10-50", "Bright LEDs for indicators and projects."],
    ["Resistor Pack (80 pcs)", "Passive Components", "20-80", "Assorted resistors for all your circuit needs."],
    ["Capacitor Pack (Mixed)", "Passive Components", "20-100", "Various capacitors for filtering and timing."],
    ["HC-SR04 Ultrasonic Sensor", "Distance Sensor", "150-250", "Measure distance with sonar."],
    ["DHT11 Temperature & Humidity Sensor", "Temperature Sensor", "100-200", "Measure temp and humidity digitally."],
    ["16x2 LCD Display", "Display", "80-150", "Classic character display for Arduino."],
    ["ESP32 Development Board", "Microcontroller Board", "300-600", "Powerful WiFi + Bluetooth board."],
    ["ESP8266 WiFi Module", "WiFi Module", "200-400", "Low cost WiFi for IoT projects."],
    ["Servo Motor SG90", "Actuator", "150-300", "Tiny servo for movement."],
    ["DC Motor (30 RPM)", "Motor", "100-200", "Slow speed high torque motor."],
    ["Relay Module 5V (1 Channel)", "Relay", "50-150", "Control high power devices."],
    ["Buzzer (Active)", "Audio Component", "20-60", "Make noise w/ simple voltage."],
    ["Push Button Switch", "Switch", "5-30", "Tactile input button."],
    ["Diode 1N4007 (Pack of 10)", "Passive Components", "10-40", "Standard rectifier diode."],
    ["Transistor BC547", "Semiconductor", "5-25", "NPN general purpose transistor."],
    ["Potentiometer 10K", "Variable Resistor", "20-100", "Adjustable resistance."],
    ["PIR Motion Sensor Module", "Motion Sensor", "100-200", "Detect human motion."],
    ["IR Receiver Module", "Infrared Sensor", "50-150", "Receive IR signals from remotes."],
    ["Light Sensor (LDR) Module", "Light Sensor", "50-120", "Detect ambient light levels."],
    ["Soil Moisture Sensor", "Soil Sensor", "80-200", "Monitor plant water needs."],
    ["7 Segment Display (1 Digit)", "Display", "20-80", "Simple numeric display."],
    ["I2C 16x2 LCD Module", "Display", "150-300", "LCD with easy I2C interface."],
    ["OLED Display 0.96 Inch", "Display", "200-400", "Crisp graphic display."],
    ["Motor Driver Module L298N", "Motor Driver", "100-200", "Drive DC and stepper motors."],
    ["Arduino Nano", "Microcontroller Board", "200-500", "Tiny breadboard friendly Arduino."],
    ["Arduino Mega 2560", "Microcontroller Board", "600-1200", "Huge IO for big projects."],
    ["Flame Sensor Module", "Fire Sensor", "80-150", "Detect fire sources."],
    ["Sound Sensor Module", "Audio Sensor", "80-180", "Detect sound levels."],
    ["Gas Sensor MQ-5", "Gas Sensor", "150-300", "Detect gas leaks."],
    ["Accelerometer ADXL345", "Motion Sensor", "150-300", "Measure acceleration."],
    ["Gyroscope MPU6050", "Motion Sensor", "200-400", "6-axis motion tracking."],
    ["Laser Module", "Laser", "100-250", "Red laser diode module."],
    ["Magnetic Reed Switch", "Switch Sensor", "50-150", "Detect magnetic fields."],
    ["Hall Effect Sensor", "Magnetic Sensor", "50-150", "Solid state magnetic sensor."],
    ["Tilt Switch Module", "Tilt Sensor", "30-100", "Detect orientation."],
    ["PS2 Game Joystick Module", "Input Module", "100-250", "Analog joystick input."],
    ["Passive Buzzer Module", "Audio Component", "20-80", "Generate tones via PWM."],
    ["LED Traffic Light Module", "LED Module", "80-150", "Mini traffic light for teaching."],
    ["Stepper Motor NEMA 17", "Motor", "400-800", "Precision stepper motor."],
    ["Power Supply Module 5V", "Power Supply", "100-300", "Breadboard power supply."],
    ["USB to Serial Converter", "Converter", "100-250", "Connect serial devices to PC."],
    ["Bluetooth Module HC-05", "Wireless Module", "300-600", "Bluetooth classic serial."],
    ["SIM800L GSM Module", "Cellular Module", "250-500", "GPRS/GSM connectivity."],
    ["Soldering Iron Kit", "Tool", "200-600", "Starter kit for soldering."],
    ["Multimeter (Digital)", "Measuring Tool", "300-1000", "Measure V/I/R."],
    ["IC 74HC595 Shift Register", "Integrated Circuit", "20-80", "Expand output pins."],
    ["10K Sliding Potentiometer", "Variable Resistor", "80-200", "Linear slider control."]
];

async function main() {
    console.log("Seeding database...");

    // Clear existing data
    try {
        await storage.deleteAllOffers();
        await storage.deleteAllProducts();
        await storage.deleteAllStores();
    } catch (e) {
        console.log("Tables might be empty, continuing...");
    }

    // 1. Create Stores
    const storesData = [
        {
            name: "Robocraze",
            neighborhood: "Kalyan Nagar",
            deliveryTimeRange: "120-175 min",
            priceLevel: "$$"
        },
        {
            name: "Vishal Electronics",
            neighborhood: "SP Road",
            deliveryTimeRange: "60-90 min",
            priceLevel: "$"
        },
        {
            name: "Probots",
            neighborhood: "Naagarabhaavi",
            deliveryTimeRange: "60-90 min",
            priceLevel: "$$"
        }
    ];

    const createdStores: any[] = [];
    for (const s of storesData) {
        const store = await storage.createStore({
            ...s,
            logo: "https://api.dicebear.com/7.x/initials/svg?seed=" + s.name.substring(0, 2),
            description: `Top electronics store in ${s.neighborhood}`,
            distanceKm: (Math.random() * 5 + 1).toFixed(1),
            rating: (Math.random() * 1 + 4).toFixed(1)
        });
        createdStores.push(store);
        console.log(`Created Store: ${store.name}`);
    }

    // 2. Create Products
    const createdProducts: any[] = [];
    for (const item of ITEMS) {
        const [name, category, priceRange, desc] = item;
        const image = IMAGES[name] || "https://images.unsplash.com/photo-1555664424-778a690ea370?w=800&q=80"; // Fallback

        const product = await storage.createProduct({
            name,
            sku: name.replace(/\s+/g, '-').toUpperCase().slice(0, 15),
            category,
            shortDesc: desc,
            image,
            specs: ["Standard Specs", "High Quality"],
            suitability: "Makers & Engineers",
            datasheetUrl: "#"
        });
        createdProducts.push({ product, priceRange });
        console.log(`Created Product: ${product.name}`);
    }

    // 3. Create Offers (Inventory)
    // Rule: Robocraze (Index 0): All 50 products
    // Rule: Vishal (Index 1): Random 40 products
    // Rule: Probots (Index 2): Random 40 products

    // Helper to parse price range "100-200"
    const getPrice = (range: string) => {
        const [min, max] = range.split('-').map(Number);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Robocraze (All 50)
    for (const { product, priceRange } of createdProducts) {
        const price = getPrice(priceRange);
        await storage.createOffer({
            productId: product.id,
            storeId: createdStores[0].id,
            basePrice: price,
            price: price, // No discount for now
            eta: 120 + Math.floor(Math.random() * 55), // Within 120-175 roughly
            stock: 100,
            displayedDeliveryFee: 40
        });
    }
    console.log("Stocked Robocraze with 50 items");

    // Vishal (Random 40)
    const vishalProducts = [...createdProducts].sort(() => 0.5 - Math.random()).slice(0, 40);
    for (const { product, priceRange } of vishalProducts) {
        const price = getPrice(priceRange);
        await storage.createOffer({
            productId: product.id,
            storeId: createdStores[1].id,
            basePrice: price,
            price: price,
            eta: 60 + Math.floor(Math.random() * 30), // Within 60-90
            stock: 50,
            displayedDeliveryFee: 30
        });
    }
    console.log("Stocked Vishal Electronics with 40 items");

    // Probots (Random 40)
    const probotsProducts = [...createdProducts].sort(() => 0.5 - Math.random()).slice(0, 40);
    for (const { product, priceRange } of probotsProducts) {
        const price = getPrice(priceRange);
        await storage.createOffer({
            productId: product.id,
            storeId: createdStores[2].id,
            basePrice: price,
            price: price,
            eta: 60 + Math.floor(Math.random() * 30),
            stock: 60,
            displayedDeliveryFee: 35
        });
    }
    console.log("Stocked Probots with 40 items");

    console.log("Database seeded successfully!");
}

main().catch(console.error);
