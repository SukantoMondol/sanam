import TermsAndCondition from "@/components/Pages/TermsAndCondition";

export const metadata = {
  title: `Terms and Conditions | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Read the Terms and Conditions of ${process.env.NEXT_PUBLIC_SITE_NAME} — your trusted source for premium furniture in Kuwait.`,
  robots: "index,follow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/terms-and-conditions`,
  },
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/terms-and-conditions`,
    title: "Terms and Conditions",
    description: `Read the Terms and Conditions of ${process.env.NEXT_PUBLIC_SITE_NAME} — your trusted source for premium furniture in Kuwait.`,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: [
      {
        url: "/assets/images/og.webp",
        width: 1200,
        height: 630,
        alt: "Terms and Conditions",
      },
    ],
  },
};

const TermsAndConditionPage = () => {
  const termsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${process.env.NEXT_PUBLIC_APP_URL}/terms-and-conditions`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/terms-and-conditions`,
    name: "Terms and Conditions",
    description: `Read the Terms and Conditions of ${process.env.NEXT_PUBLIC_SITE_NAME} — your trusted source for premium furniture in Kuwait.`,
    inLanguage: "en",
    mainEntity: {
      "@type": "CreativeWork",
      name: "Terms and Conditions",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/terms-and-conditions`,
      provider: {
        "@type": "Organization",
        name: process.env.NEXT_PUBLIC_SITE_NAME,
        url: process.env.NEXT_PUBLIC_APP_URL,
        logo: {
          "@type": "ImageObject",
          url: "/assets/images/logo.png",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: "info@sanamstore.net",
            telephone: "+8809647333222",
            availableLanguage: ["English", "Bengali"],
            areaServed: "BD",
          },
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: "info@sanamstore.net",
            telephone: "+8801712730507",
            availableLanguage: ["English", "Bengali"],
            areaServed: "BD",
          },
        ],
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }}
      />
      <TermsAndCondition />;
    </>
  );
};

export default TermsAndConditionPage;
