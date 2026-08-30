"use client"
import React, { useEffect } from 'react';
import { sendGTMEvent } from "@next/third-parties/google";
import { safeFbEvent, createFacebookEventParams, FACEBOOK_EVENTS } from "@/utils/facebookPixelUtils";

/**
 * CORRECTED ViewContent Event Component
 * 
 * KEY FIX: Only sends SINGLE content_id instead of all variation IDs
 * This ensures proper catalog matching in Meta Events Manager
 */
const ViewItemEvent = ({ product }) => {
    useEffect(() => {
        // ========================================
        // CRITICAL FIX: Determine single content_id
        // ========================================
        
        // OPTION 1: Use main product ID (RECOMMENDED if catalog uses product IDs)
        let content_id = product?.product?.id?.toString();
        
        // OPTION 2: Use SKU (uncomment if your catalog uses SKUs)
        // let content_id = product?.product?.sku?.toString();
        
        // OPTION 3: For variable products, use first/default variation ID
        // (uncomment if your catalog has separate entries for each variation)
        // if (product?.product?.product_type == 2 && product?.product?.product_variations?.length > 0) {
        //     content_id = product?.product?.product_variations[0]?.unique_id?.toString();
        // }

        // ========================================
        // Google Tag Manager Event (Enhanced Ecommerce)
        // ========================================
        sendGTMEvent({
            event: "view_item",
            ecommerce: {
                items: [{
                    item_id: content_id,
                    item_name: product?.product?.name,
                    item_category: product?.product?.category?.name,
                    item_variant: product?.product?.product_type === 2
                        ? product?.product?.product_variations[0]?.variation_attributes
                            .map((x) => x.value)
                            .join(", ")
                        : null,
                    item_brand: product?.product?.brand?.name,
                    price: product?.product?.price?.payable_price,
                    currency: "BDT",
                    quantity: 1,
                }],
            },
        });

        // ========================================
        // Facebook ViewContent Event
        // ========================================
        const viewContentParams = createFacebookEventParams(FACEBOOK_EVENTS.VIEW_CONTENT, {
            content_ids: [content_id], // ✅ SINGLE ID - matches catalog
            contents: [{
                id: content_id,
                quantity: 1,
                item_price: parseFloat(product?.product?.price?.payable_price)
            }],
            content_type: 'product',
            value: parseFloat(product?.product?.price?.payable_price),
            currency: 'BDT',
        });

        safeFbEvent(viewContentParams);
        
        // Debug logging (remove in production)
        console.log('✅ ViewContent Event Fired:', {
            content_id: content_id,
            product_name: product?.product?.name,
            value: product?.product?.price?.payable_price,
            catalog_match_format: 'product_id' // Change this based on your catalog
        });

    }, [product]);

    return null;
};

export default ViewItemEvent;

/**
 * TESTING CHECKLIST:
 * 
 * 1. Install Facebook Pixel Helper Chrome Extension
 * 2. Navigate to a product page
 * 3. Open Chrome DevTools → Console
 * 4. Look for: ✅ ViewContent Event Fired
 * 5. Verify content_id is a SINGLE value (not an array of many)
 * 6. Check Pixel Helper shows ViewContent with correct parameters
 * 7. Go to Meta Events Manager → Test Events
 * 8. Verify content_ids parameter matches your catalog ID format
 * 
 * EXPECTED RESULT:
 * - Pixel Helper shows: ViewContent with content_ids: ["123"]
 * - Console shows: content_id: "123"
 * - Meta catalog has product with id: 123
 * - Match rate increases within 24-48 hours
 */
