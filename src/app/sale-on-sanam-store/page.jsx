import SaleForm from "@/components/sale-form/SaleForm";

export const metadata = {
  title: `Sell on ${process.env.NEXT_PUBLIC_SITE_NAME} | Join ${process.env.NEXT_PUBLIC_SITE_NAME} Marketplace`,
  description: `Start selling your furniture on ${process.env.NEXT_PUBLIC_SITE_NAME}. Join Kuwait's leading platform for modern home and office furniture and reach thousands of customers.`,
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/sale-on-sanam-store`,
  },
  robots: "index,follow",
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/sale-on-sanam-store`,
    title: `Sell on ${process.env.NEXT_PUBLIC_SITE_NAME} | Modern Furniture Marketplace in Kuwait`,
    description: `Become a trusted seller on ${process.env.NEXT_PUBLIC_SITE_NAME}. Showcase your premium furniture collections to buyers across Kuwait with ease and confidence.`,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: [
      {
        url: "/assets/images/og.webp",
        width: 1200,
        height: 630,
        alt: `Sell on ${process.env.NEXT_PUBLIC_SITE_NAME} - Open Graph Image`,
      },
    ],
  },
};

const page = () => {
  const sameAsLinks = [
    "https://www.facebook.com/sanamstore/",
    "https://x.com/sanamstore",
    "https://www.instagram.com/sanamstore/",
    "https://www.linkedin.com/company/sanamstore/",
    "https://www.youtube.com/@SanamStore",
    "https://www.pinterest.com/sanamstore/",
  ];

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Sell on ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/sale-on-sanam-store`,
    description: `Join ${process.env.NEXT_PUBLIC_SITE_NAME} to sell your furniture and home décor products. Reach thousands of customers looking for premium furniture.`,
    publisher: {
      "@type": "Organization",
      name: process.env.NEXT_PUBLIC_SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: "/assets/images/logo.png",
      },
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: process.env.NEXT_PUBLIC_SITE_NAME,
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: {
      "@type": "ImageObject",
      url: "/assets/images/logo.png",
    },
    image: "/assets/images/logo.png",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+8809647333222",
        email: "info@sanamstore.net",
      },
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+8801712730507",
        email: "info@sanamstore.net",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "House 789, West Kazi Para, Mirpur",
      addressLocality: "Kuwait",
      addressRegion: "Kuwait",
      postalCode: "1216",
      addressCountry: "BD",
    },
    sameAs: sameAsLinks,
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: "Sanam Store",
    image: "/assets/images/logo.png",
    "@id": process.env.NEXT_PUBLIC_APP_URL,
    url: process.env.NEXT_PUBLIC_APP_URL,
    telephone: "+8809647333222",
    email: "info@sanamstore.net",
    priceRange: "KD KD ",
    address: {
      "@type": "PostalAddress",
      streetAddress: "House 789, West Kazi Para, Mirpur",
      addressLocality: "Kuwait",
      addressRegion: "Kuwait",
      postalCode: "1216",
      addressCountry: "BD",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 23.7907487,
      longitude: 90.4453202,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "22:00",
      },
    ],
    sameAs: sameAsLinks,
  };

  return (
    <>
      <script
        id="ld-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        id="ld-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        id="ld-furniturestore-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <SaleForm />;
    </>
  );
};

export default page;
