
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// The IMAGES map from seed.ts (Copy-pasted for standalone execution)
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

const TARGET_DIR = path.join(process.cwd(), 'client', 'public', 'products');

if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

function downloadImage(url: string, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(TARGET_DIR, filename));
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(path.join(TARGET_DIR, filename), () => { });
            reject(err);
        });
    });
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
            // newMapping[name] = url; // Keep original if fail? Or maybe a fallback
        }
    }

    console.log("\nDOWNLOAD COMPLETE.");
    console.log("----------------------------------------");
    console.log("Paste this into seed.ts to replace IMAGES const:");
    console.log("----------------------------------------");
    console.log(JSON.stringify(newMapping, null, 4));
}

main().catch(console.error);
