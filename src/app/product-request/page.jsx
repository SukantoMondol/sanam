import ProductRequest from "@/components/product-request/ProductRequest";

export const metadata = {
  title: `Product Request | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Request your desired furniture or home décor at ${process.env.NEXT_PUBLIC_SITE_NAME}. Share your product needs, and we'll help you find or customize the perfect match.`,
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/product-request`,
  },
  robots: "index,follow",
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/product-request`,
    title: `Product Request | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Easily request any furniture or décor item you're looking for at ${process.env.NEXT_PUBLIC_SITE_NAME}. We specialize in custom and hard-to-find designs.`,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: [
      {
        url: "/assets/images/og.webp",
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_SITE_NAME} Product Request`,
      },
    ],
  },
};

const page = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Product Request | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/product-request`,
    description: `Request your desired furniture or home décor at ${process.env.NEXT_PUBLIC_SITE_NAME}. Share your product needs, and we'll help you find or customize the perfect match.`,
    mainEntity: {
      "@type": "Organization",
      name: process.env.NEXT_PUBLIC_SITE_NAME,
      url: process.env.NEXT_PUBLIC_APP_URL,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "Customer Service - Product Request",
          email: "info@sanamstore.net",
          telephone: "+8809647333222",
          availableLanguage: ["English", "Bengali"],
          areaServed: "BD",
        },
        {
          "@type": "ContactPoint",
          contactType: "Customer Service - Product Request",
          email: "info@sanamstore.net",
          telephone: "+8801712730507",
          availableLanguage: ["English", "Bengali"],
          areaServed: "BD",
        },
      ],
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_APP_URL}/product-request`,
    },
  };

  return (
    <>
      <script
        id="ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <ProductRequest />
    </>
  );
};

export default page;
