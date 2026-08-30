import Checkout from "@/components/checkout/Checkout";

export const metadata = {
  title: `Checkout | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Complete your purchase at ${process.env.NEXT_PUBLIC_SITE_NAME}. Review your items, enter shipping details, and make payment securely.`,
  robots: "noindex,nofollow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
  },
  openGraph: {
    title: `Checkout | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Complete your purchase at ${process.env.NEXT_PUBLIC_SITE_NAME}. Secure checkout for all your furniture and home décor orders.`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: [
      {
        url: `/assets/images/og.webp`,
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_SITE_NAME} Checkout Page`,
      },
    ],
    type: "website",
  },
};

const page = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Checkout | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    description: `Complete your purchase at ${process.env.NEXT_PUBLIC_SITE_NAME}. Review your items, enter shipping details, and make payment securely.`,
    potentialAction: {
      "@type": "BuyAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
        inLanguage: "en",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      actionStatus: "https://schema.org/ActiveActionStatus",
      agent: {
        "@type": "Person",
      },
    },
    mainEntity: {
      "@type": "Organization",
      name: `${process.env.NEXT_PUBLIC_SITE_NAME}`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      logo: {
        "@type": "ImageObject",
        url: `/assets/images/logo.png`,
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+8809647333222",
          contactType: "Customer Service",
          email: "info@sanamstore.net",
          availableLanguage: ["English", "Bangla"],
          areaServed: "BD",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Checkout />
    </>
  );
};

export default page;
