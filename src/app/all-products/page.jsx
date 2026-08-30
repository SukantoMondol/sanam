import AllProductsPage from "@/components/all-products/AllProductsPage";

export const metadata = {
  title: `All Products | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Browse the full collection of premium furniture and home décor at ${process.env.NEXT_PUBLIC_SITE_NAME}. Filter by price, sort by your preference and find the perfect piece.`,
  robots: "index,follow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/all-products`,
  },
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/all-products`,
    title: `All Products | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Browse the full collection of premium furniture and home décor at ${process.env.NEXT_PUBLIC_SITE_NAME}.`,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: [
      {
        url: "/assets/images/banner/hero-slider.png",
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_SITE_NAME} All Products`,
      },
    ],
  },
};

const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `All Products | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Browse our full furniture collection at ${process.env.NEXT_PUBLIC_SITE_NAME}.`,
  url: `${process.env.NEXT_PUBLIC_APP_URL}/all-products`,
};

export default function AllProductsRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <AllProductsPage />
    </>
  );
}
