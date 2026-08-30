import ShoppingCart from "@/components/shopping-cart/ShoppingCart";

export const metadata = {
  title: `Shopping Cart | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `View and manage the items in your shopping cart at ${process.env.NEXT_PUBLIC_SITE_NAME}. Review your selected products before checkout.`,
  robots: "index,follow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
  },

  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    title: `Shopping Cart | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Review your selected furniture and décor items before placing your order at ${process.env.NEXT_PUBLIC_SITE_NAME}.`,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: [
      {
        url: "/assets/images/og.webp",
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_SITE_NAME} Open Graph Image`,
      },
    ],
  },
};

const page = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Shopping Cart | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    description: `Current shopping cart items for ${process.env.NEXT_PUBLIC_SITE_NAME} customer.`,

    potentialAction: {
      "@type": "CheckOutAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
        inLanguage: "en",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <ShoppingCart />
    </>
  );
};

export default page;
