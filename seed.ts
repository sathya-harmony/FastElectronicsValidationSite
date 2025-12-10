import { storage } from "./server/storage.js";
import { type InsertStore, type InsertProduct, type InsertOffer } from "@shared/schema.js";

const IMAGES: Record<string, string> = {
    "Arduino UNO R3": "https://robu.in/wp-content/uploads/2015/11/SKU-6337-462x550.jpg",
    "Breadboard 400 Points": "https://robu.in/wp-content/uploads/2019/07/400-Tie-Points-Contacts-Mini-Circuit-Experiment-Solderless-Breadboard-1.jpg",
    "Jumper Wires (Set of 40)": "https://robu.in/wp-content/uploads/2017/09/120pcs-Dupont-Breadboard-Pack-PCB-Jumpers-10CM-2-54MM-Wire-Male-To-Male-Male-To-Female.jpg",
    "HC-SR04 Ultrasonic Sensor": "https://robu.in/wp-content/uploads/2022/08/ultra-462x462.jpg",
    "DHT11 Temperature & Humidity Sensor": "https://robu.in/wp-content/uploads/2017/04/DHT11-Digital-Relative-Humidity-Temperature-Sensor-Module-ROBU.IN_-2.jpg",
    "16x2 LCD Display": "https://robu.in/wp-content/uploads/2023/08/1642597-462x462.jpg",
    "ESP32 Development Board": "https://robu.in/wp-content/uploads/2021/05/22-462x462.jpg",
    "ESP8266 WiFi Module": "https://robu.in/wp-content/uploads/2019/12/20-462x462.jpg",
    "Servo Motor SG90": "https://robu.in/wp-content/uploads/2025/02/1503-1-462x462.jpg",
    "DC Motor (30 RPM)": "https://robu.in/wp-content/uploads/2025/07/19048-2.jpg",
    "Relay Module 5V (1 Channel)": "https://robu.in/wp-content/uploads/2021/12/1-8.jpg",
    "Motor Driver Module L298N": "https://robu.in/wp-content/uploads/2021/04/l298n-motor-driver-module-robu-in-462x462.jpg",
    "Arduino Nano": "https://robu.in/wp-content/uploads/2024/09/robu-nano-462x462.jpg",
    "Arduino Mega 2560": "https://robu.in/wp-content/uploads/2019/12/Arduino-Mega-2560-Rev3-462x462.jpg",
    "Gyroscope MPU6050": "https://robu.in/wp-content/uploads/2016/03/SKU-12038.png",
    "PIR Motion Sensor Module": "https://robu.in/wp-content/uploads/2020/06/20.2-462x462.jpg",
    "IR Receiver Module": "https://robu.in/wp-content/uploads/2017/09/FPJ7QFFJ5K5TO0R.jpg",
    "Light Sensor (LDR) Module": "https://robu.in/wp-content/uploads/2015/07/LDR-Light-Dependant-Resistor-5mm-ROBU.IN_-462x462.jpg",
    "Soil Moisture Sensor": "https://robu.in/wp-content/uploads/2023/11/1701337-462x462.jpg",
    "Flame Sensor Module": "https://robu.in/wp-content/uploads/2016/10/Flame-Sensor-Module-ROBU.IN_-1-462x462.jpg",
    "Sound Sensor Module": "https://robu.in/wp-content/uploads/2021/04/Sound-Sensor-Module-robu.in_-1.jpg",
    "Gas Sensor MQ-5": "https://robu.in/wp-content/uploads/2015/07/LPG-Gas-Sensor-MQ-5-462x462.jpg",
    "Bluetooth Module HC-05": "https://robu.in/wp-content/uploads/2019/07/485216.jpg",
    "SIM800L GSM Module": "https://robu.in/wp-content/uploads/2017/09/694.jpg",
    "Soldering Iron Kit": "https://robu.in/wp-content/uploads/2025/10/DSC_8104.jpg",
    "OLED Display 0.96 Inch": "https://robu.in/wp-content/uploads/2025/01/10-11-462x462.jpg",
    "LEDs 5mm (Pack of 10)": "https://robu.in/wp-content/uploads/2019/11/56.jpg",
    "Resistor Pack (80 pcs)": "https://robu.in/wp-content/uploads/2019/03/100pcs-Resistor-Kit-4.jpg",
    "Capacitor Pack (Mixed)": "https://robu.in/wp-content/uploads/2018/11/400Pcs-Ceramic-Capacitor-Assortment-Kit-1-462x462.jpg",
    "Buzzer (Active)": "https://robu.in/wp-content/uploads/2017/09/aihasd-actif-module-driver-buzzer-dalarme-ordinateur-monopuce-pour-arduino-smart-car-electricite.jpg",
    "Push Button Switch": "https://robu.in/wp-content/uploads/2020/09/Tactile-Push-Button-Switch-Assorted-Kit-%E2%80%93-25-pcs-00.jpg",
    "Diode 1N4007 (Pack of 10)": "https://robu.in/wp-content/uploads/2015/10/1N4007-Rectifier-Diode-462x462.jpg",
    "Transistor BC547": "https://robu.in/wp-content/uploads/2018/06/BC547-NPN-Transistor-462x462.jpg",
    "Potentiometer 10K": "https://robu.in/wp-content/uploads/2019/01/10k-Ohm-Potentiometer-462x462.jpg",
    "7 Segment Display (1 Digit)": "https://robu.in/wp-content/uploads/2017/10/7-Segment-1-Inch-Display-Common-Anode-Red-462x462.jpg",
    "Laser Module": "https://robu.in/wp-content/uploads/2016/05/SKU099871F1.jpg",
    "Magnetic Reed Switch": "https://robu.in/wp-content/uploads/2017/09/robu.jpg",
    "Hall Effect Sensor": "https://robu.in/wp-content/uploads/2017/06/keyas.jpg",
    "Tilt Switch Module": "https://robu.in/wp-content/uploads/2017/09/tilt-switch-module.jpg",
    "PS2 Game Joystick Module": "https://robu.in/wp-content/uploads/2016/03/3-53.jpg",
    "Passive Buzzer Module": "https://robu.in/wp-content/uploads/2024/04/moo.50.jpg",
    "LED Traffic Light Module": "https://robu.in/wp-content/uploads/2017/09/2.png",
    "Stepper Motor NEMA 17": "https://robu.in/wp-content/uploads/2023/04/42HS34-0404-NEMA17.jpg",
    "Power Supply Module 5V": "https://robu.in/wp-content/uploads/2016/03/12-5.jpg",
    "USB to Serial Converter": "https://robu.in/wp-content/uploads/2025/06/R243085-2.jpg",
    "Multimeter (Digital)": "https://robu.in/wp-content/uploads/2015/09/DT830D-Digital-Multimeter-ROBU.IN_-1-462x462.jpg",
    "IC 74HC595 Shift Register": "https://robu.in/wp-content/uploads/2018/06/74HC595-Shift-Register-IC-462x462.jpg",
    "10K Sliding Potentiometer": "https://robu.in/wp-content/uploads/2018/12/10K-Ohm-Linear-Slide-Potentiometer-462x462.jpg",
    "Accelerometer ADXL345": "https://robu.in/wp-content/uploads/2017/08/018-gy-291.jpg",
    "I2C 16x2 LCD Module": "https://robu.in/wp-content/uploads/2023/08/1642597-462x462.jpg"
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
