import DeliveryAndReturnPolicy from "@/components/Pages/DeliveryAndReturnPolicy";

export const metadata = {
  title: `Delivery and Return Policy | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Read ${process.env.NEXT_PUBLIC_SITE_NAME}' Delivery and Return Policy. Learn about our shipping timelines, return process, and how we ensure your satisfaction.`,
  robots: "index,follow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/delivery-and-return-policy`,
  },
  openGraph: {
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    title: `Delivery and Return Policy - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Read ${process.env.NEXT_PUBLIC_SITE_NAME}' Delivery and Return Policy. Learn about our shipping timelines, return process, and how we ensure your satisfaction.`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/delivery-and-return-policy`,
    type: "website",
    images: [
      {
        url: `/assets/images/og.webp`,
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_SITE_NAME} Open Graph Image`,
      },
    ],
  },
};

const DeliveryAndReturnPolicyPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: process.env.NEXT_PUBLIC_SITE_NAME,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/delivery-and-return-policy`,
    description:
      "Check our delivery and return policy for hassle-free shopping.",
    image: `/assets/images/logo.png`,
    offers: {
      "@type": "Offer",
      priceCurrency: "KWD",
      price: "0.00",
      availability: "https://schema.org/InStock",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0.00",
          currency: "KWD",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            value: 1, // 1 day handling
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            value: 4, // 4 days transit
            unitCode: "d",
          },
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "BD",
        },
      },

      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        returnFees: "FreeReturn",
        merchantReturnDays: 30,
        applicableCountry: "BD",
        inStoreReturnsOffered: false,
        returnMethod: "ReturnByMail",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <DeliveryAndReturnPolicy />;
    </>
  );
};

export default DeliveryAndReturnPolicyPage;
