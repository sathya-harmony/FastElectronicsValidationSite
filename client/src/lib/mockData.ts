import arduinoImage from '@assets/generated_images/arduino_uno_board.png';
import rpiImage from '@assets/generated_images/raspberry_pi_4.png';
import motorImage from '@assets/generated_images/drone_motor.png';
import vishalLogo from '@assets/generated_images/vishal_electronics_logo.png';
import probotLogo from '@assets/generated_images/probot_logo.png';
import robocrazeLogo from '@assets/generated_images/robocraze_logo.png';

// Mock Data for ThunderFast Electronics

export type Store = {
  id: string;
  name: string;
  neighborhood: string;
  rating: number;
  deliveryTimeRange: string;
  priceLevel: '₹' | '₹₹' | '₹₹₹';
  logo: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  image: string;
  specs: string[];
};

export type Offer = {
  id: string;
  productId: string;
  storeId: string;
  price: number;
  eta: number; // minutes
  stock: number;
};

export const stores: Store[] = [
  {
    id: 's1',
    name: 'Vishal Electronics',
    neighborhood: 'Koramangala',
    rating: 4.5,
    deliveryTimeRange: '60-90 min',
    priceLevel: '₹₹',
    logo: vishalLogo,
    description: 'Trusted source for components and tools since 2010.'
  },
  {
    id: 's2',
    name: 'Probot',
    neighborhood: 'Indiranagar',
    rating: 4.8,
    deliveryTimeRange: '45-75 min',
    priceLevel: '₹₹₹',
    logo: probotLogo,
    description: 'Specialists in high-end robotics and drone parts.'
  },
  {
    id: 's3',
    name: 'Robocraze',
    neighborhood: 'HSR Layout',
    rating: 4.2,
    deliveryTimeRange: '70-100 min',
    priceLevel: '₹',
    logo: robocrazeLogo,
    description: 'Affordable kits and educational electronics.'
  }
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Arduino Uno R3',
    category: 'Microcontrollers',
    shortDesc: 'The classic microcontroller for all your projects.',
    image: arduinoImage,
    specs: ['ATmega328P', '5V logic', '14 Digital I/O']
  },
  {
    id: 'p2',
    name: 'Raspberry Pi 4 Model B',
    category: 'Single Board Computers',
    shortDesc: 'Desktop performance in a tiny credit-card size.',
    image: rpiImage,
    specs: ['4GB RAM', 'Quad-core CPU', 'Dual 4K support']
  },
  {
    id: 'p3',
    name: '920KV Brushless Motor',
    category: 'Drone Parts',
    shortDesc: 'High efficiency motor for quadcopters.',
    image: motorImage,
    specs: ['920KV', '3-4S LiPo', 'Standard Mount']
  },
  {
    id: 'p4',
    name: 'HC-SR04 Ultrasonic Sensor',
    category: 'Sensors',
    shortDesc: 'Distance measuring module.',
    image: 'https://images.unsplash.com/photo-1555664424-778a69032054?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 
    specs: ['2cm - 400cm range', '5V operation']
  },
  {
    id: 'p5',
    name: 'LiPo Battery 2200mAh 3S',
    category: 'Power',
    shortDesc: 'Reliable power for your drone or RC car.',
    image: 'https://images.unsplash.com/photo-1615858039237-77b319d67b2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 
    specs: ['11.1V', '30C Discharge', 'XT60 Connector']
  }
];

export const offers: Offer[] = [
  // Arduino Offers
  { id: 'o1', productId: 'p1', storeId: 's1', price: 550, eta: 75, stock: 10 },
  { id: 'o2', productId: 'p1', storeId: 's2', price: 650, eta: 50, stock: 5 },
  { id: 'o3', productId: 'p1', storeId: 's3', price: 480, eta: 95, stock: 20 },
  
  // RPi Offers
  { id: 'o4', productId: 'p2', storeId: 's1', price: 4500, eta: 80, stock: 2 },
  { id: 'o5', productId: 'p2', storeId: 's2', price: 4800, eta: 45, stock: 8 },

  // Motor Offers
  { id: 'o6', productId: 'p3', storeId: 's2', price: 1200, eta: 55, stock: 12 },
  { id: 'o7', productId: 'p3', storeId: 's3', price: 1100, eta: 90, stock: 4 },

  // Sensor Offers
  { id: 'o8', productId: 'p4', storeId: 's1', price: 150, eta: 65, stock: 50 },
  { id: 'o9', productId: 'p4', storeId: 's3', price: 120, eta: 85, stock: 30 },

  // Battery Offers
  { id: 'o10', productId: 'p5', storeId: 's2', price: 1800, eta: 60, stock: 6 }
];

export const categories = [
  'Microcontrollers', 'Single Board Computers', 'Sensors', 'Drone Parts', 'Power', 'Tools'
];

export const neighborhoods = [
  'Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'Jayanagar', 'Electronic City'
];
