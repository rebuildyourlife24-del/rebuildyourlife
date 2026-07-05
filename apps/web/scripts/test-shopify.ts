import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(__dirname, '../../../.env') });

import { getProducts } from '../src/lib/shopify';

async function test() {
  console.log("Checking Shopify Storefront connection for", process.env.SHOPIFY_STORE_DOMAIN);
  try {
    const products = await getProducts();
    console.log(`✅ Success! Found ${products.length} products.`);
    if (products.length > 0) {
      console.log("First product:", products[0].title);
    }
  } catch (error) {
    console.error("❌ Failed:", error);
  }
}
test();
