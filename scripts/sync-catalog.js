/**
 * Facebook Catalog Sync Script for Sanam Store
 * 
 * This script syncs your product database with Meta's Product Catalog
 * ensuring that content_ids sent by Pixel events match catalog IDs
 * 
 * Run this script daily via cron or GitHub Actions
 */

const axios = require('axios');

// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
  // Meta Business Settings
  CATALOG_ID: '1937471203323560', // Get from Meta Commerce Manager
  ACCESS_TOKEN: process.env.FACEBOOK_CAPI_ACCESS_TOKEN,
  PIXEL_ID: process.env.NEXT_PUBLIC_FB_PIXEL_ID,
  
  // Your API endpoint that returns all products
  PRODUCTS_API: process.env.BASE_URL + '/api/products',
  
  // Website base URL
  SITE_URL: process.env.NEXT_PUBLIC_APP_URL,
  
  // Batch size for API calls (max 5000)
  BATCH_SIZE: 1000,
};

// ========================================
// FETCH PRODUCTS FROM YOUR DATABASE
// ========================================
async function fetchAllProducts() {
  try {
    console.log('📦 Fetching products from database...');
    
    // Replace this with your actual API call
    const response = await axios.get(CONFIG.PRODUCTS_API, {
      headers: {
        'Authorization': 'Bearer YOUR_API_TOKEN',
      },
      params: {
        per_page: 10000, // Get all products
        status: 'active',
      }
    });
    
    const products = response.data.data;
    console.log(`✅ Fetched ${products.length} products`);
    
    return products;
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
    throw error;
  }
}

// ========================================
// TRANSFORM PRODUCTS TO CATALOG FORMAT
// ========================================
function transformProductToCatalogFormat(product) {
  // CRITICAL: Ensure 'id' matches what your Pixel sends in content_ids
  const catalogItem = {
    id: product.id, // ⚠️ MUST match Pixel's content_ids (as integer)
    // id: product.sku, // Alternative: use SKU if catalog uses SKUs
    
    title: product.name,
    description: product.short_description || product.description,
    availability: product.is_out_of_stock ? 'out of stock' : 'in stock',
    condition: 'new',
    price: `${product.price?.payable_price || product.price} BDT`,
    link: `${CONFIG.SITE_URL}/product-details/${product.slug}`,
    image_link: product.photo,
    brand: product.brand?.name || 'Sanam Store',
    
    // Optional but recommended fields
    google_product_category: product.category?.name,
    product_type: product.category?.name,
    sale_price: product.price?.discount ? `${product.price.payable_price} BDT` : undefined,
    sale_price_effective_date: product.price?.discount ? '2024-01-01/2025-12-31' : undefined,
    item_group_id: product.parent_id?.toString(), // For variations
    
    // Custom labels for filtering
    custom_label_0: product.category?.name,
    custom_label_1: product.brand?.name,
    custom_label_2: product.is_featured ? 'featured' : 'regular',
    custom_label_3: product.is_new ? 'new' : 'existing',
    custom_label_4: product.price?.discount ? 'on_sale' : 'regular_price',
  };
  
  // Remove undefined values
  Object.keys(catalogItem).forEach(key => {
    if (catalogItem[key] === undefined) {
      delete catalogItem[key];
    }
  });
  
  return catalogItem;
}

// ========================================
// HANDLE PRODUCT VARIATIONS
// ========================================
function generateVariationCatalogItems(product) {
  const items = [];
  
  if (product.product_type === 2 && product.product_variations?.length > 0) {
    // Add each variation as a separate catalog item
    product.product_variations.forEach(variation => {
      const variationItem = {
        id: variation.unique_id, // ⚠️ Variation-specific ID (keep as-is, may be string like "124-BLUE-L")
        title: `${product.name} - ${variation.variation_attributes.map(a => a.value).join(' / ')}`,
        description: product.short_description,
        availability: variation.variation_inventory?.stock > 0 ? 'in stock' : 'out of stock',
        condition: 'new',
        price: `${variation.variation_price.payable_price} BDT`,
        link: `${CONFIG.SITE_URL}/product-details/${product.slug}`,
        image_link: variation.product_variation_photo?.photo_thumb || product.photo,
        brand: product.brand?.name || 'Sanam Store',
        item_group_id: product.id, // Link to parent product (as integer)
        size: variation.variation_attributes.find(a => a.name === 'Size')?.value,
        color: variation.variation_attributes.find(a => a.name === 'Color')?.value,
        google_product_category: product.category?.name,
        product_type: product.category?.name,
      };
      
      items.push(variationItem);
    });
  } else {
    // Simple product without variations
    items.push(transformProductToCatalogFormat(product));
  }
  
  return items;
}

// ========================================
// SYNC PRODUCTS TO META CATALOG
// ========================================
async function syncToMetaCatalog(products) {
  try {
    console.log('🔄 Syncing products to Meta Catalog...');
    
    // Transform all products to catalog format
    const catalogItems = [];
    products.forEach(product => {
      const items = generateVariationCatalogItems(product);
      catalogItems.push(...items);
    });
    
    console.log(`📊 Total catalog items (including variations): ${catalogItems.length}`);
    
    // Split into batches
    const batches = [];
    for (let i = 0; i < catalogItems.length; i += CONFIG.BATCH_SIZE) {
      batches.push(catalogItems.slice(i, i + CONFIG.BATCH_SIZE));
    }
    
    console.log(`📦 Split into ${batches.length} batches`);
    
    // Upload each batch
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`⬆️  Uploading batch ${i + 1}/${batches.length} (${batch.length} items)...`);
      
      try {
        const response = await axios.post(
          `https://graph.facebook.com/v18.0/${CONFIG.CATALOG_ID}/batch`,
          {
            access_token: CONFIG.ACCESS_TOKEN,
            requests: batch.map(item => ({
              method: 'UPDATE',
              retailer_id: item.id,
              data: item,
            })),
          }
        );
        
        console.log(`✅ Batch ${i + 1} uploaded successfully`);
        
        // Log any errors from the batch
        if (response.data.errors && response.data.errors.length > 0) {
          console.warn(`⚠️  Batch ${i + 1} had ${response.data.errors.length} errors:`);
          response.data.errors.slice(0, 5).forEach(error => {
            console.warn(`   - Item ${error.retailer_id}: ${error.message}`);
          });
        }
      } catch (error) {
        console.error(`❌ Error uploading batch ${i + 1}:`, error.response?.data || error.message);
      }
      
      // Rate limiting: wait 1 second between batches
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('✅ Catalog sync complete!');
  } catch (error) {
    console.error('❌ Error syncing to Meta Catalog:', error.message);
    throw error;
  }
}

// ========================================
// VALIDATE CATALOG SYNC
// ========================================
async function validateCatalogSync() {
  try {
    console.log('🔍 Validating catalog sync...');
    
    // Fetch catalog stats
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${CONFIG.CATALOG_ID}`,
      {
        params: {
          access_token: CONFIG.ACCESS_TOKEN,
          fields: 'name,product_count,vertical',
        },
      }
    );
    
    console.log('📊 Catalog Stats:');
    console.log(`   Name: ${response.data.name}`);
    console.log(`   Product Count: ${response.data.product_count}`);
    console.log(`   Vertical: ${response.data.vertical}`);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error validating catalog:', error.response?.data || error.message);
    throw error;
  }
}

// ========================================
// GENERATE CSV CATALOG FEED (ALTERNATIVE)
// ========================================
async function generateCSVFeed(products) {
  const fs = require('fs');
  const csv = require('csv-stringify/sync');
  
  console.log('📄 Generating CSV catalog feed...');
  
  const catalogItems = [];
  products.forEach(product => {
    const items = generateVariationCatalogItems(product);
    catalogItems.push(...items);
  });
  
  const csvData = csv.stringify(catalogItems, {
    header: true,
    columns: [
      'id',
      'title',
      'description',
      'availability',
      'condition',
      'price',
      'link',
      'image_link',
      'brand',
      'google_product_category',
      'product_type',
      'item_group_id',
      'size',
      'color',
    ],
  });
  
  const filename = `catalog_feed_${new Date().toISOString().split('T')[0]}.csv`;
  fs.writeFileSync(filename, csvData);
  
  console.log(`✅ CSV feed saved to: ${filename}`);
  console.log(`📊 Total products: ${catalogItems.length}`);
  
  return filename;
}

// ========================================
// MAIN EXECUTION
// ========================================
async function main() {
  console.log('🚀 Starting catalog sync for Sanam Store...\n');
  
  try {
    // Step 1: Fetch products
    const products = await fetchAllProducts();
    
    // Step 2: Choose sync method
    const SYNC_METHOD = 'API'; // Change to 'API' for direct upload
    
    if (SYNC_METHOD === 'API') {
      // Method A: Direct API sync
      await syncToMetaCatalog(products);
      await validateCatalogSync();
    } else {
      // Method B: Generate CSV for manual upload
      const csvFile = await generateCSVFeed(products);
      console.log('\n📤 Next steps:');
      console.log('1. Go to Meta Commerce Manager');
      console.log('2. Select your catalog');
      console.log('3. Go to Data Sources → Add Items → Upload File');
      console.log(`4. Upload: ${csvFile}`);
    }
    
    console.log('\n✅ Sync completed successfully!');
  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  fetchAllProducts,
  transformProductToCatalogFormat,
  generateVariationCatalogItems,
  syncToMetaCatalog,
  generateCSVFeed,
};

/**
 * USAGE:
 * 
 * 1. Install dependencies:
 *    npm install axios csv-stringify
 * 
 * 2. Set environment variables:
 *    export FACEBOOK_CAPI_ACCESS_TOKEN="your_token"
 *    export NEXT_PUBLIC_FB_PIXEL_ID="2786320594894981"
 *    export BASE_URL="https://api.sanamstore.net"
 *    export NEXT_PUBLIC_APP_URL="https://sanamstore.net"
 * 
 * 3. Run the script:
 *    node sync-catalog.js
 * 
 * 4. Schedule daily sync (cron):
 *    0 2 * * * cd /path/to/project && node sync-catalog.js >> /var/log/catalog-sync.log 2>&1
 * 
 * IMPORTANT:
 * - Update CONFIG.CATALOG_ID with your actual catalog ID
 * - Ensure the 'id' field matches what your Pixel sends
 * - For variable products, decide if you want:
 *   a) Separate catalog items per variation (recommended)
 *   b) Single item per product (simpler but less accurate)
 * 
 * TROUBLESHOOTING:
 * - If sync fails with 401: Check access token
 * - If sync fails with 404: Verify catalog ID
 * - If match rate still 0%: Verify 'id' format matches Pixel's content_ids
 */
