import PrivacyPolicy from "@/components/Pages/PrivacyPolicy";

export const metadata = {
  title: `Privacy Policy | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Read the Privacy Policy of ${process.env.NEXT_PUBLIC_SITE_NAME} to understand how we collect, use, and protect your personal information.`,
  robots: "index, follow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/privacy-policy`,
  },
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/privacy-policy`,
    title: `Privacy Policy | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Learn how ${process.env.NEXT_PUBLIC_SITE_NAME} handles your data and ensures your privacy.`,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: [
      {
        url: `/assets/images/og.webp`,
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_SITE_NAME} - Privacy Policy Overview`,
      },
    ],
  },
};

const PrivacyPolicyPage = async () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Privacy Policy | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/privacy-policy`,
    description: `Read the Privacy Policy of ${process.env.NEXT_PUBLIC_SITE_NAME} to understand how we collect, use, and protect your personal information.`,
    mainEntity: {
      "@type": "CreativeWork",
      headline: `${process.env.NEXT_PUBLIC_SITE_NAME} Privacy Policy`,
      about: "Privacy Policy",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/privacy-policy`,
      publisher: {
        "@type": "Organization",
        name: process.env.NEXT_PUBLIC_SITE_NAME,
        url: process.env.NEXT_PUBLIC_APP_URL,
        logo: {
          "@type": "ImageObject",
          url: `/assets/images/logo.png`,
        },
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PrivacyPolicy />
    </>
  );
};

export default PrivacyPolicyPage;
