
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// The IMAGES map from seed.ts (Copy-pasted for standalone execution)
const IMAGES: Record<string, string> = {
    // Verified Replacement URLs for broken items (Batch 1 & 2 & 3)
    "Capacitor Pack (Mixed)": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Electronic-Component-Ceramic-Capacitor.jpg",
    "Diode 1N4007 (Pack of 10)": "https://upload.wikimedia.org/wikipedia/commons/2/23/Diode_1N4007.jpg",
    "Transistor BC547": "https://upload.wikimedia.org/wikipedia/commons/2/24/BC546B_transistor_%2801%29.jpg",
    "Potentiometer 10K": "https://upload.wikimedia.org/wikipedia/commons/b/b5/10k_Ohm_Breadboard_Compatible_Potentiometer.jpg",
    "Light Sensor (LDR) Module": "https://upload.wikimedia.org/wikipedia/commons/a/a2/LDR07_Light-dependent_CdS_photoresistor.jpg",
    "Soil Moisture Sensor": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Soil_moisture_sensor.JPG",
    "7 Segment Display (1 Digit)": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Seven_segment_display_1_digit_%28red%29.svg/200px-Seven_segment_display_1_digit_%28red%29.svg.png",
    "Motor Driver Module L298N": "https://raw.githubusercontent.com/hibit-dev/l298n-motor-driver/master/images/l298n-motor-driver-module-pinout.png", // Fallback to pinout/photo from HiBit
    "Arduino Nano": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Arduino_Nano.jpg/320px-Arduino_Nano.jpg",
    "Arduino Mega 2560": "https://upload.wikimedia.org/wikipedia/commons/3/39/Arduino_Mega_2560.jpg",
    "Flame Sensor Module": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Flame-igniter%28top%29-and-flame-sensor.jpg/320px-Flame-igniter%28top%29-and-flame-sensor.jpg",
    "Sound Sensor Module": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Electronic_component_microphone.jpg/320px-Electronic_component_microphone.jpg",
    "Gas Sensor MQ-5": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Gas_sensor.jpg/320px-Gas_sensor.jpg",
    "Multimeter (Digital)": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Digital_Multimeter_Aka.jpg",
    "IC 74HC595 Shift Register": "https://upload.wikimedia.org/wikipedia/commons/2/23/74HC595.jpg",
    "10K Sliding Potentiometer": "https://upload.wikimedia.org/wikipedia/commons/c/c2/Mini_Star_416_-_Slide_potentiometer-2973.jpg",

    // Original Robu URLs (kept as backup/for others)
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
    "Gyroscope MPU6050": "https://robu.in/wp-content/uploads/2016/03/SKU-12038.png",
    "PIR Motion Sensor Module": "https://robu.in/wp-content/uploads/2020/06/20.2-462x462.jpg",
    "IR Receiver Module": "https://robu.in/wp-content/uploads/2017/09/FPJ7QFFJ5K5TO0R.jpg",
    "Bluetooth Module HC-05": "https://robu.in/wp-content/uploads/2019/07/485216.jpg",
    "SIM800L GSM Module": "https://robu.in/wp-content/uploads/2017/09/694.jpg",
    "Soldering Iron Kit": "https://robu.in/wp-content/uploads/2025/10/DSC_8104.jpg",
    "OLED Display 0.96 Inch": "https://robu.in/wp-content/uploads/2025/01/10-11-462x462.jpg",
    "LEDs 5mm (Pack of 10)": "https://robu.in/wp-content/uploads/2019/11/56.jpg",
    "Resistor Pack (80 pcs)": "https://robu.in/wp-content/uploads/2019/03/100pcs-Resistor-Kit-4.jpg",
    "Buzzer (Active)": "https://robu.in/wp-content/uploads/2017/09/aihasd-actif-module-driver-buzzer-dalarme-ordinateur-monopuce-pour-arduino-smart-car-electricite.jpg",
    "Push Button Switch": "https://robu.in/wp-content/uploads/2020/09/Tactile-Push-Button-Switch-Assorted-Kit-%E2%80%93-25-pcs-00.jpg",
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
    "Accelerometer ADXL345": "https://robu.in/wp-content/uploads/2017/08/018-gy-291.jpg",
    "I2C 16x2 LCD Module": "https://robu.in/wp-content/uploads/2023/08/1642597-462x462.jpg"
};

const TARGET_DIR = path.join(process.cwd(), 'client', 'public', 'products');

if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

async function downloadImage(url: string, filename: string): Promise<void> {
    const filePath = path.join(TARGET_DIR, filename);
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://www.google.com/'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        fs.writeFileSync(filePath, buffer);
        console.log(`Saved ${filename} (${buffer.length} bytes)`);
    } catch (error) {
        if (fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch { }
        }
        throw error;
    }
}

function sanitizeFilename(name: string): string {
    return name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with dash
        .replace(/^-+|-+$/g, '') // trim dashes
        + '.jpg';
}

async function main() {
    console.log("Starting image download...");
    const newMapping: Record<string, string> = {};

    for (const [name, url] of Object.entries(IMAGES)) {
        const filename = sanitizeFilename(name);
        try {
            console.log(`Downloading ${name}...`);
            await downloadImage(url, filename);
            newMapping[name] = `/products/${filename}`;
        } catch (error) {
            console.error(`Error downloading ${name}:`, error);
        }
    }

    console.log("\nDOWNLOAD COMPLETE.");
    console.log("----------------------------------------");
    console.log("Paste this into seed.ts to replace IMAGES const:");
    console.log("----------------------------------------");
    console.log(JSON.stringify(newMapping, null, 4));
}

main().catch(console.error);
