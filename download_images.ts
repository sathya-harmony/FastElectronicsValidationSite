
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// The IMAGES map from seed.ts (Copy-pasted for standalone execution)
import { IMAGES } from "./shared/images";

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
