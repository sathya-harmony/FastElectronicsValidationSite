
import { storage } from "../server/storage";
import { products } from "../shared/schema";

const PRODUCT_DATA: Record<string, { desc: string; specs: string[] }> = {
    "Arduino UNO R3": {
        desc: "The Arduino Uno R3 is a microcontroller board based on the ATmega328P. It has 14 digital input/output pins (of which 6 can be used as PWM outputs), 6 analog inputs, a 16 MHz ceramic resonator, a USB connection, a power jack, an ICSP header, and a reset button. It contains everything needed to support the microcontroller; simply connect it to a computer with a USB cable or power it with an AC-to-DC adapter or battery to get started.",
        specs: ["Microcontroller: ATmega328P", "Operating Voltage: 5V", "Input Voltage (recommended): 7-12V", "Digital I/O Pins: 14 (6 PWM)", "Analog Input Pins: 6", "Flash Memory: 32 KB", "Clock Speed: 16 MHz"]
    },
    "Breadboard 400 Points": {
        desc: "A 400-point solderless breadboard ideal for prototyping and testing small electronic circuits. It features a standard 0.1-inch spacing and accepts wire sizes from 20 to 29 AWG. The board includes 2 power rails and 30 columns of 5 connected terminals.",
        specs: ["Total Tie Points: 400", "Terminal Strip Points: 300", "Distribution Strip Points: 100", "Dimensions: 82mm x 55mm x 8.5mm", "Wire Size: 20-29 AWG", "Voltage/Current: 300V / 3A to 5A"]
    },
    "Jumper Wires (Set of 40)": {
        desc: "A set of 40 multi-colored jumper wires (Male-to-Male, Male-to-Female, or Female-to-Female depending on selection) for breadboarding and prototyping. essential for connecting components without soldering.",
        specs: ["Quantity: 40 wires", "Length: 20cm (approx)", "Colors: Assorted", "Connector Type: Dupoint 2.54mm pitch"]
    },
    "HC-SR04 Ultrasonic Sensor": {
        desc: "The HC-SR04 ultrasonic sensor uses sonar to determine distance to an object like bats or dolphins do. It offers excellent non-contact range detection with high accuracy and stable readings in an easy-to-use package. From 2cm to 400 cm or 1\" to 13 feet.",
        specs: ["Power Supply: 5V DC", "Quiescent Current: <2mA", "Working Current: 15mA", "Effectual Angle: <15°", "Ranging Distance: 2cm – 400 cm", "Resolution: 0.3 cm"]
    },
    "DHT11 Temperature & Humidity Sensor": {
        desc: "The DHT11 is a basic, low-cost digital temperature and humidity sensor. It uses a capacitive humidity sensor and a thermistor to measure the surrounding air, and spits out a digital signal on the data pin (no analog input pins needed).",
        specs: ["Humidity Range: 20-90% RH", "Humidity Accuracy: ±5% RH", "Temperature Range: 0-50°C", "Temperature Accuracy: ±2°C", "Operating Voltage: 3-5.5V"]
    },
    "16x2 LCD Display": {
        desc: "A 16x2 Character LCD Display capable of displaying 16 characters on 2 lines. It uses the standard HD44780 controller interface and can be operated in 4-bit or 8-bit mode. Widely used in Arduino projects for user interface.",
        specs: ["Display Format: 16 Character x 2 Line", "Controller: HD44780 or equivalent", "Backlight: Blue/Green", "Interface: Parallel (4/8 bit)", "Operating Voltage: 5V"]
    },
    "ESP32 Development Board": {
        desc: "The ESP32 is a powerful, generic Wi-Fi+BT+BLE MCU module that targets a wide variety of applications, ranging from low-power sensor networks to the most demanding tasks, such as voice encoding, music streaming and MP3 decoding.",
        specs: ["Dual-core 32-bit LX6 Microprocessor", "WiFi: 802.11 b/g/n", "Bluetooth: v4.2 BR/EDR and BLE", "Clock Frequency: Up to 240MHz", "Flash Memory: 4MB", "Operating Voltage: 3.3V"]
    },
    "ESP8266 WiFi Module": {
        desc: "The ESP8266 (NodeMCU) is a low-cost Wi-Fi microchip, with a full TCP/IP stack and microcontroller capability using the Tensilica L106 32-bit RISC processor. It allows you to control inputs and outputs as you would with a normal Arduino, but with WiFi capabilities.",
        specs: ["Microcontroller: Tensilica 32-bit RISC", "Operating Voltage: 3.3V", "Input Voltage: 7-12V", "Flash Memory: 4MB", "Clock Speed: 80 MHz", "WiFi: 802.11 b/g/n"]
    },
    "Servo Motor SG90": {
        desc: "Tiny and lightweight with high output power. Servo can rotate approximately 180 degrees (90 in each direction), and works just like the standard kinds but smaller. You can use any servo code, hardware or library to control these servos.",
        specs: ["Weight: 9g", "Dimension: 22.2 x 11.8 x 31 mm approx.", "Stall torque: 1.8 kgf·cm", "Operating speed: 0.1 s/60 degree", "Operating voltage: 4.8 V (~5V)"]
    },
    "DC Motor (30 RPM)": {
        desc: "A standard DC Gear motor with a metal gearbox, offering high torque at low speeds (30 RPM). Ideal for robotics projects like rovers or conveyor belts requiring reasonable power and durability.",
        specs: ["Rated RPM: 30", "Operating Voltage: 12V", "Stall Torque: High", "Shaft Diameter: 6mm", "Gearbox: Metal"]
    },
    "Relay Module 5V (1 Channel)": {
        desc: "This is a 5V 1-Channel Relay interface board, capable of controlling various appliances and other equipment with large current. It can be controlled directly by Microcontroller (Arduino, 8051, AVR, PIC, DSP, ARM, ARM, MSP430, TTL logic).",
        specs: ["Channel: 1", "Control Voltage: 5V", "Load Voltage: AC 250V 10A / DC 30V 10A", "Indicator LED: Yes", "Active: Low/High configurable"]
    },
    "Motor Driver Module L298N": {
        desc: "The L298N is a dual H-Bridge motor driver which allows speed and direction control of two DC motors at the same time. The module can drive DC motors that have voltages between 5 and 35V, with a peak current up to 2A.",
        specs: ["Driver Chip: L298N", "Logic Voltage: 5V", "Drive Voltage: 5V-35V", "Drive Current: 2A (MAX single bridge)", "Max Power: 25W"]
    },
    "Arduino Nano": {
        desc: "The Arduino Nano is a small, complete, and breadboard-friendly board based on the ATmega328. It works with a Mini-B USB cable, and offers the same connectivity and specs as the UNO board in a smaller form factor.",
        specs: ["Microcontroller: ATmega328", "Operating Voltage: 5V", "Input Voltage: 7-12V", "Digital I/O Pins: 14", "Analog Input Pins: 8", "Flash Memory: 32 KB"]
    },
    "Arduino Mega 2560": {
        desc: "The Arduino Mega 2560 is a microcontroller board based on the ATmega2560. It has 54 digital input/output pins (of which 15 can be used as PWM outputs), 16 analog inputs, 4 UARTs (hardware serial ports), a 16 MHz crystal oscillator, a USB connection, a power jack, an ICSP header, and a reset button.",
        specs: ["Microcontroller: ATmega2560", "Operating Voltage: 5V", "Digital I/O: 54", "Analog Inputs: 16", "Flash Memory: 256 KB", "SRAM: 8 KB", "EEPROM: 4 KB"]
    },
    "Gyroscope MPU6050": {
        desc: "The MPU-6050 sensor module contains a MEMS accelerometer and a MEMS gyro in a single chip. It is very accurate, as it contains 16-bits analog to digital conversion hardware for each channel. Therefore it captures the x, y, and z channel at the same time.",
        specs: ["Chip: MPU-6050", "Power Supply: 3-5V", "Communication: I2C", "Gyroscope Range: ±250, 500, 1000, 2000 °/s", "Accelerometer Range: ±2, ±4, ±8, ±16 g"]
    },
    "PIR Motion Sensor Module": {
        desc: "PIR sensors allow you to sense motion, almost always used to detect whether a human has moved in or out of the sensors range. They are small, inexpensive, low-power, easy to use and don't wear out.",
        specs: ["Input Voltage: 5V-20V", "Detection Range: <120 degrees", "Detection Distance: 3-7 meters (adjustable)", "Delay Time: 5-200s (adjustable)"]
    },
    "IR Receiver Module": {
        desc: "A generic IR Receiver Sensor module compatible with 38KHz IR signals. Ideal for receiving commands from TV remotes or other IR controllers in Arduino projects.",
        specs: ["Operating Voltage: 5V", "Frequency: 38KHz", "Receiving Angle: 90 degrees", "Receiving Distance: 18m"]
    },
    "Light Sensor (LDR) Module": {
        desc: "A photosensitive resistance sensor module that detects the intensity of ambient light. The module output determines high/low based on the light threshold set by the potentiometer.",
        specs: ["Operating Voltage: 3.3V-5V", "Output Format: Digital & Analog", "Sensor Type: Photoresistor (LDR)", "Adjustable Sensitivity: Yes"]
    },
    "Soil Moisture Sensor": {
        desc: "This Soil Moisture Sensor can read the amount of moisture present in the soil surrounding it. It's a low tech sensor, but ideal for monitoring an urban garden or your pet plant's water level.",
        specs: ["Operating Voltage: 3.3V-5V", "Output Mode: Analog & Digital", "Current: <20mA", "Probe Material: Nickel Plated"]
    },
    "Flame Sensor Module": {
        desc: "A flame sensor module that can detect flame or light source of wavelength in the range of 760nm-1100nm. The detection angle is about 60 degrees, particularly sensitive to the flame spectrum.",
        specs: ["Spectrum Range: 760nm ~ 1100nm", "Detection Angle: 60 degree", "Operating Voltage: 3.3V-5V", "Output: Digital & Analog"]
    },
    "Sound Sensor Module": {
        desc: "A sound detection module that can detect sound intensity in the environment. Note that this sensor can recognize the presence or absence of sound (based on threshold) but not the specific frequency.",
        specs: ["Operating Voltage: 3.3V-5V", "Output: Digital", "Chip: LM393", "Sensitivity: Adjustable via potentiometer"]
    },
    "Gas Sensor MQ-5": {
        desc: "The MQ-5 Gas Sensor module is suitable for detecting H2, LPG, CH4, CO, Alcohol. Due to its high sensitivity and fast response time, measurements can be taken as soon as possible.",
        specs: ["Target Gas: LPG, Natural Gas, Town Gas", "Detection Range: 300-10000ppm", "Heater Voltage: 5V", "Loop Voltage: <= 24V"]
    },
    "Bluetooth Module HC-05": {
        desc: "HC-05 module is an easy to use Bluetooth SPP (Serial Port Protocol) module, designed for transparent wireless serial connection setup. It can be used in a Master or Slave configuration.",
        specs: ["Bluetooth Protocol: v2.0+EDR", "Frequency: 2.4GHz ISM band", "Modulation: GFSK", "Speed: Async: 2.1Mbps(Max) / 160 kbps", "Operating Voltage: 3.3V"]
    },
    "SIM800L GSM Module": {
        desc: "Mini GSM / GPRS breakout board based on the SIM800L module, supports quad-band GSM/GPRS network, available for GPRS and SMS message data remote transmission.",
        specs: ["Chip: SIM800L", "Voltage: 3.7-4.2V", "Support: Quad-band 850/900/1800/1900MHz", "Interface: TTL Serial"]
    },
    "Soldering Iron Kit": {
        desc: "A complete soldering iron starter kit including a 60W adjustable temperature soldering iron, stand, solder wire, desoldering pump, and varied tips. Perfect for beginners and hobbyists.",
        specs: ["Power: 60W", "Voltage: 110V/220V", "Temp Range: 200°C - 450°C", "Plug Type: Standard"]
    },
    "OLED Display 0.96 Inch": {
        desc: "A monochromatic 0.96-inch OLED display module with 128x64 resolution. It uses the I2C interface, making it easy to connect with Arduino with just 4 wires.",
        specs: ["Resolution: 128x64", "Driver IC: SSD1306", "Interface: I2C", "Voltage: 3.3V-5V", "Display Color: Blue/White"]
    },
    "LEDs 5mm (Pack of 10)": {
        desc: "Standard 5mm through-hole LEDs in a pack of 10. Great for indicators, breadboard circuits, and simple lighting projects.",
        specs: ["Size: 5mm", "Lens: Diffused", "Forward Voltage: 1.8V-3.2V (depending on color)", "Current: 20mA"]
    },
    "Resistor Pack (80 pcs)": {
        desc: "A variety pack of 1/4W metal film resistors. Includes commonly used values like 100Ω, 220Ω, 1kΩ, 10kΩ, etc., essential for any electronics workbench.",
        specs: ["Power Rating: 1/4 Watt", "Tolerance: 1%", "Type: Metal Film", "Quantity: 80 pcs"]
    },
    "Capacitor Pack (Mixed)": {
        desc: "An assortment of ceramic and electrolytic capacitors of various values. Useful for filtering, timing, and decoupling in circuits.",
        specs: ["Type: Ceramic & Electrolytic", "Voltage: Various", "Values: 10pF to 470uF mixed"]
    },
    "Buzzer (Active)": {
        desc: "An active buzzer module that produces a single-tone sound when powered. It has a built-in oscillator, so it's as easy as powering it on to make noise.",
        specs: ["Type: Active", "Operating Voltage: 3.3V-5V", "Sound Output: >85dB", "Resonant Freq: 2300Hz"]
    },
    "Push Button Switch": {
        desc: "Standard tactile momentary push buttons. They fit perfectly into breadboards and are the go-to component for adding user input to projects.",
        specs: ["Type: Momentary Tactile", "Size: 6x6x5mm", "Rating: 50mA 12V DC", "Mounting: Through-hole"]
    },
    "Diode 1N4007 (Pack of 10)": {
        desc: "1N4007 is a general-purpose silicon rectifier diode. It is widely used in power supply circuits, reverse polarity protection, and flyback protection.",
        specs: ["Type: Rectifier Diode", "Max Reverse Voltage: 1000V", "Max Forward Current: 1A", "Forward Drop: ~1V"]
    },
    "Transistor BC547": {
        desc: "BC547 is a general-purpose NPN bipolar junction transistor (BJT) used for amplification and switching purposes in low-power circuits.",
        specs: ["Type: NPN", "Max Collector Current: 100mA", "Max Collector-Emitter Voltage: 45V", "Gain (hFE): 110-800"]
    },
    "Potentiometer 10K": {
        desc: "A 10k Ohm rotary potentiometer (variable resistor) with a knob. Used for adjusting analog signals like volume, brightness, or sensitivity.",
        specs: ["Resistance: 10kΩ", "Type: Linear Taper", "Power Rating: 0.5W", "Rotation: 300°"]
    },
    "7 Segment Display (1 Digit)": {
        desc: "A generic single-digit 7-segment LED display. By controlling the 8 pins (7 segments + decimal point), you can display numbers 0-9 and some letters.",
        specs: ["Digit Height: 0.56 inch", "Common: Cathode/Anode", "Color: Red", "Forward Voltage: 2V"]
    },
    "Laser Module": {
        desc: "A compact red laser diode module (650nm). Draws very little power and can be driven directly from an Arduino digital pin for laser pointers or tripwires.",
        specs: ["Wavelength: 650nm (Red)", "Operating Voltage: 5V", "Output Power: <5mW", "Beam Shape: Dot"]
    },
    "Magnetic Reed Switch": {
        desc: "A reed switch module that closes a circuit in the presence of a magnetic field. Useful for door/window sensors or speedometers.",
        specs: ["Type: Normally Open", "Max Voltage: 100V", "Max Current: 0.5A", "Glass Length: 14mm"]
    },
    "Hall Effect Sensor": {
        desc: "A sensor that detects magnetic fields using the Hall Effect. Unlike a reed switch, it has no moving parts and can detect polarity/strength (depending on specific model like A3144).",
        specs: ["Sensor: A3144 or equivalent", "Operating Voltage: 4.5V-24V", "Output: Digital Open-Collector", "Hysteresis: Yes"]
    },
    "Tilt Switch Module": {
        desc: "A simple sensor that detects orientation or inclination. It contains a metal ball that completes the circuit when tilted upright.",
        specs: ["Type: Ball Switch", "Operating Voltage: <12V", "Current: <20mA", "Angle: >15 degrees"]
    },
    "PS2 Game Joystick Module": {
        desc: "A 2-axis analog joystick module similar to those found on game controllers. Includes X and Y potentiometers and a push-button switch.",
        specs: ["Operating Voltage: 5V", "Output: 2 Analog (X,Y), 1 Digital (Btn)", "Resistance: 10kΩ", "Durability: Long life"]
    },
    "Passive Buzzer Module": {
        desc: "Unlike the active buzzer, this passive buzzer requires a square wave (PWM) signal to generate sound. This allows you to create different tones and melodies.",
        specs: ["Type: Passive", "Operating Voltage: 3.3V-5V", "Frequency: Controllable", "Resistance: 16Ω"]
    },
    "LED Traffic Light Module": {
        desc: "A pre-assembled module with Red, Yellow, and Green LEDs arranged like a traffic light. Great for beginner programming exercises and simulation.",
        specs: ["LEDs: 5mm Red, Yellow, Green", "Common: Cathode", "Interface: Digital", "Resistors: Built-in"]
    },
    "Stepper Motor NEMA 17": {
        desc: "High-precision NEMA 17 stepper motor widely used in 3D printers and CNC machines. Offers high torque and precise positioning steps.",
        specs: ["Size: NEMA 17 (42mm)", "Step Angle: 1.8°", "Holding Torque: 40-45 Ncm", "Rated Current: 1.5A/phase"]
    },
    "Power Supply Module 5V": {
        desc: "A breadboard-friendly power supply module that fits standard 400/830 point breadboards. Takes DC jack or USB input and provides 3.3V and 5V rails.",
        specs: ["Input Voltage: 6.5-12V (DC) or USB power", "Output Voltage: 3.3V / 5V switchable", "Max Current: 700mA", "Onboard Switch: Yes"]
    },
    "USB to Serial Converter": {
        desc: "A module using CP2102, CH340, or FTDI chips to convert USB data to TTL Serial. Essential for programming Pro Minis or debugging serial devices.",
        specs: ["Chip: CP2102/CH340", "Voltage: 5V/3.3V", "Interface: USB A to TTL Pin Header", "Support: Windows/Linux/Mac"]
    },
    "Multimeter (Digital)": {
        desc: "A handheld digital multimeter for measuring voltage, current, and resistance. An indispensable tool for troubleshooting circuits.",
        specs: ["DC Voltage: 200mV-600V", "AC Voltage: 200V-600V", "DC Current: 2mA-10A", "Resistance: 200Ω-2MΩ", "Display: LCD"]
    },
    "IC 74HC595 Shift Register": {
        desc: "The 74HC595 is an 8-bit serial-in, parallel-out shift register. It allows you to control 8 output pins using only 3 microcontroller pins. Great for driving LEDs or LCDs.",
        specs: ["Logic Family: HC", "Bits: 8", "Voltage: 2V-6V", "Package: DIP-16", "Clock Speed: 100MHz"]
    },
    "10K Sliding Potentiometer": {
        desc: "A linear sliding potentiometer (fader) with 10kΩ resistance. Provides a linear analog output based on the slider position. Useful for mixers or linear controls.",
        specs: ["Resistance: 10kΩ", "Type: Linear Slide", "Travel: ~60mm", "Output: Dual Analog"]
    },
    "Accelerometer ADXL345": {
        desc: "The ADXL345 is a small, thin, ultralow power, 3-axis accelerometer with high resolution (13-bit) measurement at up to ±16 g.",
        specs: ["Axes: 3 (X, Y, Z)", "Range: ±2g/±4g/±8g/±16g", "Interface: SPI/I2C", "Power: 20-140uA"]
    },
    "I2C 16x2 LCD Module": {
        desc: "A standard 16x2 LCD with a pre-soldered I2C backpack. This reduces the wiring from ~12 pins down to just 4 (VCC, GND, SDA, SCL).",
        specs: ["Display: 16 char x 2 lines", "Interface: I2C (Address 0x27 or 0x3F)", "Backlight: Adjustable", "Contrast: Adjustable"]
    }
};

async function main() {
    console.log("Starting DB enrichment with AI data...");
    const allProducts = await storage.getAllProducts();

    let updatedCount = 0;

    for (const product of allProducts) {
        const aiData = PRODUCT_DATA[product.name];

        if (aiData) {
            console.log(`Enriching ${product.name}...`);
            await storage.updateProduct(product.id, {
                longDescription: aiData.desc,
                specs: aiData.specs
            });
            updatedCount++;
        } else {
            console.log(`Skipping ${product.name} (No AI Data)`);
        }
    }

    console.log(`Done! Updated ${updatedCount} products.`);
}

main().catch(console.error);
