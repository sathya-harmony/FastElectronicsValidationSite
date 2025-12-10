
import { storage, db } from "../server/storage";
import * as cheerio from "cheerio";
import { products } from "../shared/schema";
import { eq } from "drizzle-orm";

const ROBU_SEARCH_URL = "https://robu.in/?s=";

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeRobu(productName: string) {
    try {
        // 1. Search for the product
        const searchUrl = `${ROBU_SEARCH_URL}${encodeURIComponent(productName)}&post_type=product`;
        console.log(`Searching: ${searchUrl}`);

        const searchRes = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!searchRes.ok) throw new Error(`Search Failed: ${searchRes.status}`);
        const searchHtml = await searchRes.text();
        const $search = cheerio.load(searchHtml);

        // Find the first product link
        const firstProductLink = $search('.product-title a').first().attr('href');

        if (!firstProductLink) {
            console.log(`No results found for ${productName}`);
            return null;
        }

        console.log(`Found product page: ${firstProductLink}`);

        // 2. Fetch product page
        // add small delay
        await sleep(1000);

        const productRes = await fetch(firstProductLink, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!productRes.ok) throw new Error(`Product Page Failed: ${productRes.status}`);
        const productHtml = await productRes.text();
        const $product = cheerio.load(productHtml);

        // 3. Extract Info
        // Description: often in #tab-description or .woocommerce-product-details__short-description
        let longDescription = $product('#tab-description').text().trim();
        if (!longDescription) {
            longDescription = $product('.woocommerce-product-details__short-description').text().trim();
        }

        // Clean up description (too long?)
        // Remove "Description" title if present
        longDescription = longDescription.replace(/^Description/i, '').trim();

        // Specs: usually in a table inside #tab-additional_information or just in description
        // Let's try to parse the table if it exists
        const specs: string[] = [];
        $product('table.woocommerce-product-attributes tr').each((_, el) => {
            const key = $product(el).find('th').text().trim();
            const value = $product(el).find('td').text().trim();
            if (key && value) {
                specs.push(`${key}: ${value}`);
            }
        });

        // If no table specs, try to find ul li in description
        if (specs.length === 0) {
            $product('#tab-description ul li').each((_, el) => {
                specs.push($product(el).text().trim());
            });
        }

        return {
            longDescription: longDescription.slice(0, 2000), // Limit length just in case
            specs
        };

    } catch (e) {
        console.error(`Error scraping ${productName}:`, e);
        return null;
    }
}

async function main() {
    console.log("Starting scraping process...");
    const allProducts = await storage.getAllProducts();

    for (const product of allProducts) {
        console.log(`----------------------------------------`);
        console.log(`Processing: ${product.name}`);

        // Skip if already has long description (optional, but good for retries)
        // if (product.longDescription) {
        //   console.log("Already has description, skipping...");
        //   continue;
        // }

        const data = await scrapeRobu(product.name);

        if (data) {
            console.log(`Updating ${product.name}...`);
            console.log(`Specs found: ${data.specs.length}`);

            await storage.updateProduct(product.id, {
                longDescription: data.longDescription,
                specs: data.specs.length > 0 ? data.specs : product.specs // Keep old specs if none found
            });
            console.log("Updated!");
        }

        // Polite delay
        await sleep(2000);
    }

    console.log("Done!");
}

main().catch(console.error);
