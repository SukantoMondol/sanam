import Category from "@/components/Category/Category";
import axiosInstance from "@/utils/axiosInstance";
import { cache } from "react";

export async function generateMetadata({ params, searchParams }) {
  const { slug } = (await params) || {};
  const queryParams = (await searchParams) || {};
  const safeSlug = typeof slug === "string" ? slug : "";
  const productsData = await fetchProductsPageData(safeSlug, queryParams);

  const categoryName =
    productsData?.category_name || safeSlug.replace(/-/g, " ") || "Category";
  const description =
    productsData?.seo?.description ||
    `Explore the ${categoryName} collection at ${process.env.NEXT_PUBLIC_SITE_NAME}.`;
  const keywords = productsData?.seo?.keywords || "";
  const canonical = `${process.env.NEXT_PUBLIC_APP_URL}/category/${safeSlug}`;

  return {
    title: `${categoryName} | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description,
    robots: "index,follow",
    keywords,
    alternates: {
      canonical,
    },

    openGraph: {
      type: "website",
      url: canonical,
      title: `${categoryName} | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
      description,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME,
      images: productsData?.seo?.og_image
        ? [
            {
              url: productsData.seo.og_image,
              width: 1200,
              height: 630,
              alt: `${process.env.NEXT_PUBLIC_SITE_NAME} Open Graph Image`,
            },
          ]
        : [],
    },
  };
}

export const revalidate = 600; // Revalidate every 10 minutes

const fetchProductsPageData = cache(async (slug, queryParams) => {
  try {
    const response = await axiosInstance.get(
      `/get-products-by-category/${slug}`,
      { params: queryParams }
    );
    return response?.data?.data;
  } catch (error) {
    console.error("[category] fetchProductsPageData error:", error?.message || error);
    return null;
  }
});

const ProductPage = async ({ params, searchParams }) => {
  const { slug } = (await params) || {};
  const queryParams = (await searchParams) || {};
  const safeSlug = typeof slug === "string" ? slug : "";
  const productsData = await fetchProductsPageData(safeSlug, queryParams);

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${productsData?.category_name} | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Browse the ${productsData?.category_name} collection at ${process.env.NEXT_PUBLIC_SITE_NAME}. Discover premium-quality furniture and home décor.`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/category/${safeSlug}`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: productsData?.bread_crumb?.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item?.name,
      item: `${process.env.NEXT_PUBLIC_APP_URL}/category/${item?.slug}`,
    })) || [],
  };

  if (!productsData) {
    return (
      <div className="container py-5">
        <h1 className="mb-3">Category temporarily unavailable</h1>
        <p>Please try again later or explore another category.</p>
      </div>
    );
  }

  return (
    <>
      {/* CollectionPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema),
        }}
      />

      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Category productsData={productsData} />
    </>
  );
};

export default ProductPage;
