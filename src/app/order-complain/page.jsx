import OrderComplain from "@/components/order-complain/OrderComplain";

export const metadata = {
  title: `Order Complain | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Submit and track your order complaints with ${process.env.NEXT_PUBLIC_SITE_NAME}. Our support team is here to help resolve your issues quickly.`,

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/order-complain`,
  },
  robots: "index,follow",
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/order-complain`,
    title: `Order Complain | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Submit and track your order complaints with ${process.env.NEXT_PUBLIC_SITE_NAME}. Our support team is here to help resolve your issues quickly.`,
    siteName: `${process.env.NEXT_PUBLIC_SITE_NAME}`,
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

const schema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Order Complain | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  url: `${process.env.NEXT_PUBLIC_APP_URL}/order-complain`,
  description: `Submit and track your order complaints with ${process.env.NEXT_PUBLIC_SITE_NAME}. Our support team is here to help resolve your issues quickly.`,
  inLanguage: "en",
  mainEntity: {
    "@type": "FurnitureStore",
    name: process.env.NEXT_PUBLIC_SITE_NAME,
    url: process.env.NEXT_PUBLIC_APP_URL,
    image: "/assets/images/logo.png",
    telephone: "+8809647333222",
    priceRange: "KD KD ",
    address: {
      "@type": "PostalAddress",
      streetAddress: "House 789, West Kazi Para, Mirpur",
      addressLocality: "Kuwait",
      addressRegion: "Kuwait",
      postalCode: "1216",
      addressCountry: "BD",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        telephone: "+8809647333222",
        email: "info@sanamstore.net",
        availableLanguage: ["English", "Bangla"],
      },
    ],
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
  },
};

const page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <OrderComplain />
    </>
  );
};

export default page;
