import Contact from "@/components/contact-us/Contact";

export const metadata = {
  title: `Contact Us | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Get in touch with ${process.env.NEXT_PUBLIC_SITE_NAME} for premium-quality furniture and home décor. Our team is ready to assist you with your inquiries, orders, and support.`,
  robots: "index,follow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/contact-us`,
  },
  openGraph: {
    title: `Contact Us | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Reach out to ${process.env.NEXT_PUBLIC_SITE_NAME} for all your furniture and home décor needs.`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/contact-us`,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: [
      {
        url: `/assets/images/og.webp`,
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_SITE_NAME} Open Graph Image`,
      },
    ],
    type: "website",
  },
};

const page = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Us",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/contact-us`,
    mainEntity: {
      "@type": "Organization",
      name: `${process.env.NEXT_PUBLIC_SITE_NAME}`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      logo: {
        "@type": "ImageObject",
        url: "/assets/images/logo.png",
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
      <Contact />
    </>
  );
};

export default page;
