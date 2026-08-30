"use client"
import React, {useEffect, useRef} from 'react';
import { trackViewItem } from "@/utils/ga4Ecommerce";


const ViewItemEvent = ({product}) => {
    // Prevent duplicate events in React Strict Mode (development)
    const eventFired = useRef(false);

    useEffect(() => {
        // Check if event already fired for this product
        if (eventFired.current) {
            console.log('view_item already fired for this product, skipping duplicate');
            return;
        }
        
        // Mark event as fired
        eventFired.current = true;

        trackViewItem(product, {
            quantity: 1,
            value: parseFloat(product?.product?.price?.payable_price || 0),
        });
    }, [product]);


    return null;
};

export default ViewItemEvent;
