import { storage } from "./storage";
import { type InsertStore, type InsertProduct, type InsertOffer } from "../shared/schema";
const IMAGES = {
  microcontroller: "/attached_assets/stock_images/arduino_uno_microcon_cb9d942d.jpg",
  esp32: "/attached_assets/stock_images/esp32_wifi_developme_9d46177c.jpg",
  components: "/attached_assets/stock_images/electronic_component_12fcf2f7.jpg",
  sensor: "/attached_assets/stock_images/ultrasonic_sensor_mo_0c389f96.jpg",
  servo: "/attached_assets/stock_images/servo_motor_robotic__18fdfb07.jpg",
  breadboard: "/attached_assets/stock_images/breadboard_prototypi_416310a6.jpg",
  led: "/attached_assets/stock_images/led_lights_colorful__e0c950c2.jpg",
  lcd: "/attached_assets/stock_images/lcd_display_module_b_29c600af.jpg",
  battery: "/attached_assets/stock_images/battery_lithium_ion__aeb1568d.jpg",
  driver: "/attached_assets/stock_images/motor_driver_module__a1b27dd7.jpg",
};

function calculatePrice(basePrice: number, distanceKm: number, marginPercent: number): { price: number; displayedDeliveryFee: number } {
  const deliveryCostPerKm = 20;
  const totalDeliveryCost = distanceKm * deliveryCostPerKm;
  const displayedDeliveryFee = Math.round(totalDeliveryCost * 0.4);
  const hiddenDeliveryCost = totalDeliveryCost - displayedDeliveryFee;
  const margin = basePrice * (marginPercent / 100);
  const price = Math.round(basePrice + hiddenDeliveryCost + margin);
  return { price, displayedDeliveryFee };
}

const PRODUCTS_DATA = [
  { name: "Arduino Uno R3 Compatible Board", sku: "DEV-UNO-R3", category: "Microcontroller/SBC", basePrice: 525, shortDesc: "The classic ATmega328P microcontroller board for prototyping and learning. Industry standard for beginners.", specs: ["ATmega328P Processor", "5V Logic Level", "14 Digital I/O Pins", "USB Type-B Connection"], image: IMAGES.microcontroller, suitability: "Medium (High Value)" },
  { name: "Arduino Nano V3 Compatible (CH340)", sku: "DEV-NANO-CH340", category: "Microcontroller/SBC", basePrice: 215, shortDesc: "Compact breadboard-friendly version with CH340 USB driver. Same capabilities as Uno in a smaller package.", specs: ["ATmega328P Processor", "Compact Form Factor", "CH340 USB Driver", "30 Pin Headers"], image: IMAGES.microcontroller, suitability: "High (Small Footprint)" },
  { name: "ESP32 Dev Board (30-pin, CP2102/CH340)", sku: "DEV-ESP32-30P", category: "IoT/Wireless Board", basePrice: 400, shortDesc: "Powerful dual-core WiFi and Bluetooth MCU. The go-to board for IoT projects with NodeMCU compatibility.", specs: ["Dual-Core 240MHz", "WiFi 802.11 b/g/n", "Bluetooth 4.2/BLE", "30 GPIO Pins"], image: IMAGES.esp32, suitability: "High (Primary IoT item)" },
  { name: "Raspberry Pi Pico", sku: "DEV-PICO", category: "Microcontroller/SBC", basePrice: 350, shortDesc: "RP2040 powered microcontroller with low power consumption. Great for embedded projects and MicroPython.", specs: ["RP2040 Dual-Core", "264KB SRAM", "2MB Flash", "26 GPIO Pins"], image: IMAGES.microcontroller, suitability: "Medium (High Demand)" },
  { name: "HC-SR04 Ultrasonic Sensor Module", sku: "SNS-HCSR04", category: "Sensor Module", basePrice: 65, shortDesc: "Distance measurement sensor using ultrasonic waves. Measures 2cm to 4m range accurately.", specs: ["2cm - 400cm Range", "5V Operation", "15° Measuring Angle", "Trigger/Echo Pins"], image: IMAGES.sensor, suitability: "High (Very Common)" },
  { name: "DHT11 Humidity & Temperature Sensor", sku: "SNS-DHT11-MOD", category: "Sensor Module", basePrice: 80, shortDesc: "Basic environmental sensing module for humidity and temperature. Perfect for weather stations.", specs: ["0-50°C Temperature", "20-90% Humidity", "Single-Wire Digital", "3.3V-5V Compatible"], image: IMAGES.sensor, suitability: "High (Very Common)" },
  { name: "PIR Motion Sensor (HC-SR501)", sku: "SNS-PIR-501", category: "Sensor Module", basePrice: 65, shortDesc: "Passive infrared motion detector for security and automation. Adjustable sensitivity and delay.", specs: ["7m Detection Range", "120° Detection Angle", "Adjustable Delay", "3.3V-5V Compatible"], image: IMAGES.sensor, suitability: "High (Security/Automation)" },
  { name: "555 Timer IC (NE555P)", sku: "IC-NE555P", category: "Integrated Circuit", basePrice: 10, shortDesc: "Versatile timer and oscillator IC. The most widely used timing chip in electronics.", specs: ["Timer/Oscillator", "4.5V-16V Supply", "Up to 500mA Output", "DIP-8 Package"], image: IMAGES.components, suitability: "High (Discrete)" },
  { name: "LM358 Dual Op-Amp IC", sku: "IC-LM358", category: "Integrated Circuit", basePrice: 10, shortDesc: "General purpose dual operational amplifier. Low power consumption with wide voltage range.", specs: ["Dual Op-Amp", "3V-32V Supply", "Low Power", "DIP-8 Package"], image: IMAGES.components, suitability: "High (Discrete)" },
  { name: "7805 Voltage Regulator IC (TO-220)", sku: "IC-7805-T220", category: "Integrated Circuit", basePrice: 10, shortDesc: "5V fixed linear regulator with 1A output. Essential for stable power supply circuits.", specs: ["5V Output", "1A Max Current", "TO-220 Package", "Thermal Overload Protection"], image: IMAGES.components, suitability: "High (Discrete)" },
  { name: "L298N Motor Driver Module", sku: "MOD-L298N", category: "Driver Module", basePrice: 200, shortDesc: "Dual H-Bridge motor driver for DC motors and steppers. Controls direction and speed.", specs: ["Dual H-Bridge", "2A per Channel", "5V-35V Logic", "PWM Speed Control"], image: IMAGES.driver, suitability: "Medium (Robotics Essential)" },
  { name: "ULN2003 Driver IC", sku: "IC-ULN2003", category: "Integrated Circuit", basePrice: 15, shortDesc: "Darlington transistor array for driving stepper motors and relays. High current capability.", specs: ["7 Darlington Pairs", "500mA per Channel", "50V Max", "DIP-16 Package"], image: IMAGES.components, suitability: "High (Discrete)" },
  { name: "74HC595 Shift Register IC", sku: "IC-74HC595", category: "Integrated Circuit", basePrice: 22, shortDesc: "8-bit serial-in, parallel-out shift register. Expand output pins with daisy-chaining.", specs: ["8-bit Register", "Serial Input", "Parallel Output", "DIP-16 Package"], image: IMAGES.components, suitability: "High (Discrete)" },
  { name: "BC547 NPN Transistor (Pack of 10)", sku: "TR-BC547-10X", category: "Transistor", basePrice: 22, shortDesc: "General purpose NPN switching transistors. Widely used for amplification and switching.", specs: ["NPN Type", "45V VCEO", "100mA IC", "TO-92 Package"], image: IMAGES.components, suitability: "High (Discrete, Bulk)" },
  { name: "BC557 PNP Transistor (Pack of 10)", sku: "TR-BC557-10X", category: "Transistor", basePrice: 22, shortDesc: "General purpose PNP switching transistors. Complementary to BC547 for push-pull circuits.", specs: ["PNP Type", "45V VCEO", "100mA IC", "TO-92 Package"], image: IMAGES.components, suitability: "High (Discrete, Bulk)" },
  { name: "1N4007 Diode (Pack of 50)", sku: "DIODE-1N4007-50X", category: "Diode", basePrice: 37, shortDesc: "General purpose rectifier diodes for power supply circuits. High voltage rating.", specs: ["1000V Peak Reverse", "1A Forward Current", "DO-41 Package", "General Rectification"], image: IMAGES.components, suitability: "High (Discrete, Bulk)" },
  { name: "5mm Red LED (Pack of 50)", sku: "LED-5MM-RED-50X", category: "Diode (LED)", basePrice: 30, shortDesc: "Standard 5mm red LEDs for indication and lighting projects. Bright and reliable.", specs: ["Red Color", "2V Forward Voltage", "20mA Current", "5mm Through-Hole"], image: IMAGES.led, suitability: "High (Discrete, Bulk)" },
  { name: "5mm Green LED (Pack of 50)", sku: "LED-5MM-GRN-50X", category: "Diode (LED)", basePrice: 30, shortDesc: "Standard 5mm green LEDs for status indication. Long lifespan and consistent brightness.", specs: ["Green Color", "2.2V Forward Voltage", "20mA Current", "5mm Through-Hole"], image: IMAGES.led, suitability: "High (Discrete, Bulk)" },
  { name: "10k Ohm Resistor (E12, 1/4W, Pk 100)", sku: "RES-10K-E12-100X", category: "Passive Component", basePrice: 22, shortDesc: "100-pack of 10k ohm resistors. Essential for pull-up, pull-down, and voltage dividers.", specs: ["10kΩ Value", "1/4W Rating", "5% Tolerance", "Through-Hole"], image: IMAGES.components, suitability: "High (Discrete, Bulk)" },
  { name: "1k Ohm Resistor (E12, 1/4W, Pk 100)", sku: "RES-1K-E12-100X", category: "Passive Component", basePrice: 22, shortDesc: "100-pack of 1k ohm resistors. Common value for current limiting and LED circuits.", specs: ["1kΩ Value", "1/4W Rating", "5% Tolerance", "Through-Hole"], image: IMAGES.components, suitability: "High (Discrete, Bulk)" },
  { name: "220 Ohm Resistor (E12, 1/4W, Pk 100)", sku: "RES-220-E12-100X", category: "Passive Component", basePrice: 22, shortDesc: "100-pack of 220 ohm resistors. Perfect value for LED current limiting at 5V.", specs: ["220Ω Value", "1/4W Rating", "5% Tolerance", "Through-Hole"], image: IMAGES.components, suitability: "High (Discrete, Bulk)" },
  { name: "4.7µF Electrolytic Capacitor (16V, Pk 10)", sku: "CAP-4.7UF-16V-10X", category: "Passive Component", basePrice: 15, shortDesc: "10-pack of 4.7µF electrolytic capacitors for filtering and decoupling applications.", specs: ["4.7µF Capacitance", "16V Rating", "Radial Lead", "Aluminum Electrolytic"], image: IMAGES.components, suitability: "High (Discrete, Bulk)" },
  { name: "100µF Electrolytic Capacitor (16V, Pk 5)", sku: "CAP-100UF-16V-5X", category: "Passive Component", basePrice: 17, shortDesc: "5-pack of 100µF electrolytic capacitors for power supply filtering.", specs: ["100µF Capacitance", "16V Rating", "Radial Lead", "Aluminum Electrolytic"], image: IMAGES.components, suitability: "High (Discrete, Bulk)" },
  { name: "0.1µF Ceramic Capacitor (104, Pk 50)", sku: "CAP-104-CER-50X", category: "Passive Component", basePrice: 30, shortDesc: "50-pack of 100nF ceramic capacitors. Essential for IC decoupling and noise filtering.", specs: ["100nF (0.1µF)", "50V Rating", "Ceramic Disc", "Through-Hole"], image: IMAGES.components, suitability: "High (Discrete, Bulk)" },
  { name: "22pF Ceramic Capacitor (22, Pk 50)", sku: "CAP-22PF-CER-50X", category: "Passive Component", basePrice: 30, shortDesc: "50-pack of 22pF ceramic capacitors for crystal oscillator circuits.", specs: ["22pF Capacitance", "50V Rating", "Ceramic Disc", "Crystal Load Caps"], image: IMAGES.components, suitability: "High (Discrete, Bulk)" },
  { name: "SG90 Micro Servo Motor", sku: "MOT-SG90", category: "Motor/Mechanical", basePrice: 150, shortDesc: "9g micro servo for robotics and RC projects. 180° rotation with PWM control.", specs: ["9g Weight", "1.8kg/cm Torque", "180° Rotation", "4.8V-6V Operation"], image: IMAGES.servo, suitability: "Medium (Robotics Essential)" },
  { name: "3.7V 18650 Li-ion Battery (Single)", sku: "PWR-18650-3.7V", category: "Power Supply", basePrice: 225, shortDesc: "Rechargeable lithium-ion battery cell. High energy density for portable projects.", specs: ["3.7V Nominal", "2200mAh Capacity", "18650 Form Factor", "Rechargeable"], image: IMAGES.battery, suitability: "Medium (High Risk)" },
  { name: "830 Point Solderless Breadboard", sku: "TOOL-BB-830", category: "Prototyping Tool", basePrice: 105, shortDesc: "Standard full-size breadboard for circuit prototyping. No soldering required.", specs: ["830 Tie Points", "Standard 0.1\" Pitch", "Power Rails", "Reusable"], image: IMAGES.breadboard, suitability: "High (Low Fragility)" },
  { name: "Jumper Wire Set (Male-Male, 40 pcs)", sku: "CBL-JUMP-MM40", category: "Cable/Connector", basePrice: 80, shortDesc: "40-piece male-to-male jumper wires for breadboard connections.", specs: ["40 Pieces", "Male-Male", "20cm Length", "Assorted Colors"], image: IMAGES.breadboard, suitability: "High (Low Fragility)" },
  { name: "Jumper Wire Set (Male-Female, 40 pcs)", sku: "CBL-JUMP-MF40", category: "Cable/Connector", basePrice: 80, shortDesc: "40-piece male-to-female jumper wires for module connections.", specs: ["40 Pieces", "Male-Female", "20cm Length", "Assorted Colors"], image: IMAGES.breadboard, suitability: "High (Low Fragility)" },
  { name: "USB A to Micro B Cable (1m)", sku: "CBL-USB-MICRO", category: "Cable/Connector", basePrice: 55, shortDesc: "USB cable for programming Arduino, ESP32 and other dev boards.", specs: ["1m Length", "USB Type-A to Micro-B", "Data + Power", "Standard USB 2.0"], image: IMAGES.components, suitability: "High (Essential Accessory)" },
  { name: "Female Header 40 Pin (Breakable, Pk 5)", sku: "CONN-FH40-5X", category: "Connector", basePrice: 40, shortDesc: "5-pack of breakable female headers for custom PCB interfaces.", specs: ["40 Pins Each", "0.1\" Pitch", "Breakable", "Through-Hole"], image: IMAGES.components, suitability: "High (Discrete, Bulk)" },
  { name: "Standard 16x2 LCD Display (Blue)", sku: "MOD-LCD-16X2", category: "Display Module", basePrice: 150, shortDesc: "16 character by 2 line LCD display with blue backlight. HD44780 compatible.", specs: ["16x2 Characters", "HD44780 Controller", "Blue Backlight", "5V Operation"], image: IMAGES.lcd, suitability: "Medium (Standard Display)" },
  { name: "MAX7219 Dot Matrix Module", sku: "MOD-MAX7219", category: "Display Module", basePrice: 200, shortDesc: "8x8 LED dot matrix with MAX7219 driver. Cascadable for larger displays.", specs: ["8x8 LED Matrix", "MAX7219 Driver", "SPI Interface", "Cascadable"], image: IMAGES.led, suitability: "Medium (Advanced Display)" },
  { name: "Piezoelectric Buzzer Module (Active)", sku: "MOD-BUZZER-ACT", category: "Transducer", basePrice: 40, shortDesc: "Active buzzer module for audio alerts and notifications. Single frequency output.", specs: ["Active Type", "5V Operation", "Fixed Frequency", "Loud Output"], image: IMAGES.sensor, suitability: "High (Low Cost)" },
  { name: "Digital Voltmeter Ammeter DC 100V 100A", sku: "TOOL-VAM-100A", category: "Testing/Tools", basePrice: 155, shortDesc: "Dual display volt and amp meter for power monitoring up to 100V and 100A.", specs: ["0-100V DC", "0-100A DC", "Dual LED Display", "Shunt Required"], image: IMAGES.lcd, suitability: "Medium (High Demand Tool)" },
  { name: "SPST ON-OFF Rocker Switch (Pk 5)", sku: "SW-ROCK-SPST-5X", category: "Switch", basePrice: 62, shortDesc: "5-pack of round rocker switches for simple on/off power control.", specs: ["SPST Type", "6A 250V Rating", "Round Design", "Panel Mount"], image: IMAGES.components, suitability: "High (Discrete, Bulk)" },
  { name: "LM393 Dual Comparator Module", sku: "MOD-LM393", category: "Integrated Circuit", basePrice: 15, shortDesc: "Dual voltage comparator IC for threshold detection circuits.", specs: ["Dual Comparator", "2V-36V Supply", "Open Collector", "DIP-8 Package"], image: IMAGES.components, suitability: "High (Discrete)" },
  { name: "LDR (Photoresistor) Module (Pack of 5)", sku: "SNS-LDR-5X", category: "Sensor Module", basePrice: 50, shortDesc: "5-pack of light dependent resistors for light sensing applications.", specs: ["Light Sensitive", "Variable Resistance", "Through-Hole", "Cadmium Sulfide"], image: IMAGES.sensor, suitability: "High (Discrete, Bulk)" },
  { name: "IR Sensor Switch E18-D80NK", sku: "SNS-IR-D80NK", category: "Sensor Module", basePrice: 315, shortDesc: "Adjustable infrared proximity sensor. Detection range up to 80cm.", specs: ["3-80cm Range", "Adjustable Distance", "NPN Output", "6-36V Supply"], image: IMAGES.sensor, suitability: "Medium (Specialized Sensor)" },
  { name: "7-Segment Display (Single Digit, Pk 5)", sku: "DISP-7SEG-5X", category: "Display Module", basePrice: 50, shortDesc: "5-pack of common cathode 7-segment displays for numerical readouts.", specs: ["Single Digit", "Common Cathode", "Red LED", "0.56\" Size"], image: IMAGES.led, suitability: "High (Discrete, Bulk)" },
  { name: "Copper Clad Laminate (10x15cm, Single)", sku: "MAT-CCL-SS", category: "PCB/Material", basePrice: 95, shortDesc: "Single-sided copper clad board for custom PCB fabrication.", specs: ["10x15cm Size", "Single Sided", "FR4 Material", "1oz Copper"], image: IMAGES.components, suitability: "Medium (Essential Material)" },
  { name: "DC Motor 3-6V (TT Motor, Pack of 2)", sku: "MOT-TT-2X", category: "Motor/Mechanical", basePrice: 100, shortDesc: "2-pack of TT gear motors for robotics chassis and wheels.", specs: ["3-6V DC", "Gear Reduction", "200 RPM", "Plastic Gearbox"], image: IMAGES.servo, suitability: "High (Robotics Essential)" },
  { name: "Motor Driver Shield for Arduino Uno", sku: "SHD-MOT-UNO", category: "Driver Module", basePrice: 250, shortDesc: "Stackable motor driver shield using L293D/L298P for Arduino Uno.", specs: ["4 DC Motors", "2 Steppers", "L293D Driver", "PWM Control"], image: IMAGES.driver, suitability: "Medium (High Value)" },
  { name: "1N5408 Power Diode (3A, Pack of 10)", sku: "DIODE-1N5408-10X", category: "Diode", basePrice: 30, shortDesc: "10-pack of 3A power rectifier diodes for higher current applications.", specs: ["1000V Peak Reverse", "3A Forward Current", "DO-201AD Package", "Power Rectification"], image: IMAGES.components, suitability: "High (Discrete, Bulk)" },
  { name: "Potentiometer 10k Ohm (Trimmer, Pk 10)", sku: "RES-POT-10K-10X", category: "Passive Component", basePrice: 32, shortDesc: "10-pack of 10k trimmer potentiometers for adjustable resistance.", specs: ["10kΩ Value", "Single Turn", "3-Pin", "Through-Hole"], image: IMAGES.components, suitability: "High (Discrete, Bulk)" },
  { name: "LiPo Battery 1000mAh (High C-rate)", sku: "PWR-LIPO-1000", category: "Power Supply", basePrice: 500, shortDesc: "High discharge rate lithium polymer battery for drones and robotics.", specs: ["3.7V Single Cell", "1000mAh", "25C Discharge", "JST Connector"], image: IMAGES.battery, suitability: "Low (Extreme Risk)" },
  { name: "Soldering Iron Tip Cleaning Sponge", sku: "TOOL-SOLDER-SPONGE", category: "Tool/Accessory", basePrice: 100, shortDesc: "Brass wire sponge for cleaning soldering iron tips. Extends tip life.", specs: ["Brass Wire", "No Water Needed", "Universal Fit", "Heat Resistant"], image: IMAGES.components, suitability: "High (Essential Tool)" },
  { name: "USB-TTL Serial Converter (CH340G)", sku: "MOD-USB-TTL-CH340", category: "Interface Module", basePrice: 95, shortDesc: "USB to TTL serial converter for programming and debugging MCUs.", specs: ["CH340G Chip", "3.3V/5V Select", "6-Pin Header", "TX/RX LEDs"], image: IMAGES.esp32, suitability: "High (Essential Accessory)" },
  { name: "Latching Push Button Switch (12mm, Pk 5)", sku: "SW-PB-LATCH-5X", category: "Switch", basePrice: 40, shortDesc: "5-pack of 12mm latching push buttons for toggle control.", specs: ["Latching Type", "12mm Panel Mount", "2A 250V", "SPST"], image: IMAGES.components, suitability: "High (Discrete, Bulk)" },
  { name: "3.3V 1A Step-Down Converter Module", sku: "MOD-BUCK-3V3", category: "Power Module", basePrice: 100, shortDesc: "Efficient buck converter for 3.3V power supply from higher voltages.", specs: ["3.3V Output", "1A Max", "92% Efficiency", "4.5-28V Input"], image: IMAGES.driver, suitability: "Medium (Essential Power)" },
  { name: "Water Level Sensor Module", sku: "SNS-WATER-LEVEL", category: "Sensor Module", basePrice: 55, shortDesc: "Probe-type water detection sensor for liquid level monitoring.", specs: ["Analog Output", "3.3V-5V Compatible", "40x16mm Size", "Corrosion Resistant"], image: IMAGES.sensor, suitability: "High (IoT application)" }
];

async function seed() {
  console.log("Seeding database...");

  await storage.deleteAllOffers();
  await storage.deleteAllProducts();
  await storage.deleteAllStores();
  console.log("Cleared existing data");

  const store1 = await storage.createStore({
    name: "Vishal Electronics",
    neighborhood: "Koramangala",
    rating: "4.5",
    deliveryTimeRange: "45-75 min",
    priceLevel: "$$",
    logo: "/attached_assets/generated_images/vishal_electronics_logo.png",
    description: "Trusted source for components and tools since 2010.",
    distanceKm: "8"
  });

  const store2 = await storage.createStore({
    name: "Probot",
    neighborhood: "Indiranagar",
    rating: "4.8",
    deliveryTimeRange: "30-60 min",
    priceLevel: "$$$",
    logo: "/attached_assets/generated_images/probot_logo.png",
    description: "Specialists in high-end robotics and drone parts.",
    distanceKm: "5"
  });

  const store3 = await storage.createStore({
    name: "Robocraze",
    neighborhood: "HSR Layout",
    rating: "4.2",
    deliveryTimeRange: "60-90 min",
    priceLevel: "$",
    logo: "/attached_assets/generated_images/robocraze_logo.png",
    description: "Affordable kits and educational electronics.",
    distanceKm: "12"
  });

  console.log("Created 3 stores");

  const createdProducts: { id: number; basePrice: number }[] = [];

  for (const productData of PRODUCTS_DATA) {
    const product = await storage.createProduct({
      name: productData.name,
      sku: productData.sku,
      category: productData.category,
      shortDesc: productData.shortDesc,
      image: productData.image,
      specs: productData.specs,
      datasheetUrl: null,
      suitability: productData.suitability
    });
    createdProducts.push({ id: product.id, basePrice: productData.basePrice });
  }

  console.log(`Created ${createdProducts.length} products`);

  const stores = [
    { store: store1, distance: 8, margin: 15, skipPercent: 0.15 },
    { store: store2, distance: 5, margin: 18, skipPercent: 0.25 },
    { store: store3, distance: 12, margin: 12, skipPercent: 0.30 }
  ];

  let offerCount = 0;

  for (const { store, distance, margin, skipPercent } of stores) {
    for (const product of createdProducts) {
      if (Math.random() < skipPercent) continue;

      const priceVariation = 0.95 + Math.random() * 0.1;
      const adjustedBasePrice = Math.round(product.basePrice * priceVariation);

      const { price, displayedDeliveryFee } = calculatePrice(adjustedBasePrice, distance, margin);

      const etaBase = distance * 5;
      const etaVariation = Math.round(Math.random() * 20);
      const eta = etaBase + etaVariation;

      const stock = Math.floor(Math.random() * 50) + 1;

      await storage.createOffer({
        productId: product.id,
        storeId: store.id,
        basePrice: adjustedBasePrice,
        price,
        displayedDeliveryFee,
        eta,
        stock
      });
      offerCount++;
    }
  }

  console.log(`Created ${offerCount} offers`);
  console.log("Database seeding complete!");
}

seed().catch(console.error);
