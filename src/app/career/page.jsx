import CareerList from "@/components/Pages/Career/CareerList";

export const metadata = {
  title: `Careers | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Explore open job positions at ${process.env.NEXT_PUBLIC_SITE_NAME}. Join our team and help shape the future of furniture and home décor in Kuwait.`,
  robots: "index,follow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/career`,
  },
  openGraph: {
    title: `Careers | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Join the ${process.env.NEXT_PUBLIC_SITE_NAME} team. See all open positions and apply today.`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/career`,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: [
      {
        url: `/assets/images/og.webp`,
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_SITE_NAME} Careers`,
      },
    ],
    type: "website",
  },
};

const CareerPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Careers | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/career`,
    description: `Explore job openings at ${process.env.NEXT_PUBLIC_SITE_NAME}.`,
  };

  return (
    <>
      <script
        id="ld-schema-career"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <CareerList />
    </>
  );
};

export default CareerPage;
