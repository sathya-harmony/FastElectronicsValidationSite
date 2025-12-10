
import { db } from "./server/storage";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Checking 'stores' table columns...");
    const result = await db.execute(sql`
        SELECT column_name, data_type, character_maximum_length, numeric_precision, numeric_scale
        FROM information_schema.columns
        WHERE table_name = 'stores';
    `);
    console.log(result.rows);
}

main().catch(console.error).then(() => process.exit(0));
