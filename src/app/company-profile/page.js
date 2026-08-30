import CompanyProfile from "@/components/Pages/CompanyProfile";

export const metadata = {
  title: `Company Profile | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `${process.env.NEXT_PUBLIC_SITE_NAME} Company Profile - Learn more about our history, mission, and values.`,
  robots: "index,follow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/company-profile`,
  },
  openGraph: {
    title: `Company Profile | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Learn more about ${process.env.NEXT_PUBLIC_SITE_NAME} – our history, mission, and values.`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/company-profile`,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: [
      {
        url: `/assets/images/og.webp`,
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_SITE_NAME} Company Profile`,
      },
    ],
    type: "website",
  },
};

const CompanyProfilePage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `Company Profile | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/company-profile`,
    mainEntity: {
      "@type": "Organization",
      name: `${process.env.NEXT_PUBLIC_SITE_NAME}`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      logo: {
        "@type": "ImageObject",
        url: `/assets/images/logo.png`,
      },
      sameAs: [
        "https://www.facebook.com/sanamstore/",
        "https://x.com/sanamstore",
        "https://www.instagram.com/sanamstore/",
        "https://www.linkedin.com/company/sanamstore/",
        "https://www.youtube.com/@SanamStore",
        "https://www.pinterest.com/sanamstore/",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+8809647333222",
          contactType: "Customer Service",
          email: "info@sanamstore.net",
          availableLanguage: ["English", "Bangla"],
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

      <CompanyProfile />
    </>
  );
};

export default CompanyProfilePage;
