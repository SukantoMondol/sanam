import CareerDetail from "@/components/Pages/Career/CareerDetail";

export async function generateMetadata({ params }) {
  const { slug } = params;
  let title = `Job Opening | ${process.env.NEXT_PUBLIC_SITE_NAME}`;
  let description = `Apply for this position at ${process.env.NEXT_PUBLIC_SITE_NAME}.`;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/career/${slug}`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const data = await res.json();
      const job = data.data || data;
      if (job?.title) {
        title = `${job.title} | Careers | ${process.env.NEXT_PUBLIC_SITE_NAME}`;
        description = job.short_description || description;
      }
    }
  } catch {
    // fallback metadata used
  }

  return {
    title,
    description,
    robots: "index,follow",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/career/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/career/${slug}`,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME,
      images: [
        {
          url: `/assets/images/og.webp`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
  };
}

const CareerDetailPage = () => {
  return <CareerDetail />;
};

export default CareerDetailPage;
