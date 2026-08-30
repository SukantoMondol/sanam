'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Replace with your actual GTM dataLayer name if it's different
const DATA_LAYER_NAME = 'dataLayer';

export const sendGTMEvent = (eventData) => {
    if (typeof window !== 'undefined' && window[DATA_LAYER_NAME]) {
        window[DATA_LAYER_NAME].push(eventData);
        console.log('GTM Event Pushed:', eventData); // For debugging
    } else {
        console.warn('dataLayer not found or not in a browser environment.');
    }
};

function GTMPageViewTracker() {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChangeComplete = (url) => {
            if (typeof window !== 'undefined') {
                sendGTMEvent({
                    event: 'page_view',
                    page: url, // Use the URL provided by the router event
                    title: document.title,
                });
            }
        };

        router.events.on('routeChangeComplete', handleRouteChangeComplete);

        // Clean up the event listener when the component unmounts
        return () => {
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
        };
    }, [router]); // Re-run effect if router instance changes (unlikely but good practice

    return null; // This component doesn't render anything visible
}

export default GTMPageViewTracker;