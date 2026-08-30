import MeetingRequest from "@/components/Pages/Meeting/MeetingRequest";

export const metadata = {
  title: `Book a Meeting | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Schedule a video call with the ${process.env.NEXT_PUBLIC_SITE_NAME} team. Choose your preferred duration, date, and time slot.`,
  robots: "index,follow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/meeting-request`,
  },
  openGraph: {
    title: `Book a Meeting | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Schedule a consultation call with the ${process.env.NEXT_PUBLIC_SITE_NAME} team.`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/meeting-request`,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: [
      {
        url: `/assets/images/og.webp`,
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_SITE_NAME} Book a Meeting`,
      },
    ],
    type: "website",
  },
};

const MeetingRequestPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Book a Meeting | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/meeting-request`,
    description: `Schedule a video call consultation with the ${process.env.NEXT_PUBLIC_SITE_NAME} team.`,
  };

  return (
    <>
      <script
        id="ld-schema-meeting"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <MeetingRequest />
    </>
  );
};

export default MeetingRequestPage;
