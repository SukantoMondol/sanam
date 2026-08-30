import axiosInstance from "@/utils/axiosInstance";
import Breadcrumb from "@/components/UI/Shared/Breadcrumb";
import nextDynamic from "next/dynamic";
const ProductDescription = nextDynamic(() =>
  import("@/components/Pages/ProductDetails/ProductDescription")
);
import ProductViewPanel from "@/components/Pages/ProductDetails/ProductViewPanel";
const ShopMore = nextDynamic(() =>
  import("@/components/Pages/ProductDetails/ShopMore")
);

import { notFound } from "next/navigation";
import ViewItemEvent from "@/components/Pages/ProductDetails/ViewItemEvent";
import { cache } from "react";
import ProductMainContent from "@/components/Pages/ProductDetails/ProductMainContent";

export async function generateMetadata({ params }) {
  const productDetailsData = await fetchProductDetailsPageData(
    (
      await params
    )?.slug
  );

  return {
    title: `${productDetailsData?.product?.seo?.title} | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: productDetailsData?.product?.seo?.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/product-details/${productDetailsData?.product?.slug}`,
    },
    robots: "index, follow",
    // keywords: productDetailsData?.product?.seo?.keywords,
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/product-details/${productDetailsData?.product?.slug}`,
      title: `${productDetailsData?.product?.name}`,
      description: productDetailsData?.product?.short_description,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME,
      images: [
        {
          url: `${productDetailsData?.product?.seo?.og_image}`,
          width: 1200,
          height: 630,
          alt: `${productDetailsData?.product?.name}`,
        },
      ],
    },
  };
}

import { fetchLiveProductDetails } from "@/services/liveApiService";

const fetchProductDetailsPageData = cache(async (slug) => {
  try {
    const data = await fetchLiveProductDetails(slug);
    if (!data || !data.product) {
      notFound();
    }
    return data;
  } catch (error) {
    notFound();
  }
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ProductDetailsPage = async ({ params }) => {
  const productDetailsData = await fetchProductDetailsPageData(
    (
      await params
    )?.slug
  );

  // schema
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    name: "Breadcrumb List",
    itemListElement: productDetailsData?.bread_crumb?.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${process.env.NEXT_PUBLIC_APP_URL}/category/${item.slug}`,
    })),
  };

  // Product Offers JSON-LD
  const offers = productDetailsData?.product?.product_variations?.length
    ? {
        "@type": "AggregateOffer",
        lowPrice: Math.min(
          ...productDetailsData?.product?.product_variations?.map(
            (v) => v.variation_price?.payable_price
          )
        ),
        highPrice: Math.max(
          ...productDetailsData?.product?.product_variations?.map(
            (v) => v.variation_price?.price
          )
        ),
        priceCurrency: "KWD",
        offerCount: productDetailsData?.product?.product_variations?.length,
        offers: productDetailsData?.product?.product_variations?.map(
          (variant) => ({
            "@type": "Offer",
            price: variant?.variation_price?.payable_price,
            priceCurrency: "KWD",
            sku: productDetailsData?.product?.sku,
            availability:
              variant?.variation_inventory?.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            url: `${process.env.NEXT_PUBLIC_APP_URL}/product-details/${productDetailsData?.product?.slug}`,
          })
        ),
      }
    : {
        "@type": "Offer",
        price: productDetailsData?.product?.price?.payable_price,
        priceCurrency: "KWD",
        availability:
          productDetailsData?.product?.is_out_of_stock > 0
            ? "https://schema.org/OutOfStock"
            : "https://schema.org/InStock",
        url: `${process.env.NEXT_PUBLIC_APP_URL}/product-details/${productDetailsData?.product?.slug}`,
      };

  // Product JSON-LD
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: productDetailsData?.product?.name,
    image: [productDetailsData?.product?.photo],
    description: productDetailsData?.product?.short_description,
    sku: productDetailsData?.product?.sku,
    brand: {
      "@type": "Brand",
      name: process.env.NEXT_PUBLIC_SITE_NAME,
    },
    offers,
  };

  return (
    <>
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />

      {/* Product JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <Breadcrumb
        items={[
          ...productDetailsData?.bread_crumb?.map((item) => ({
            label: item?.name,
            href: `/category/${item?.slug}`,
          })),
        ]}
      />

      <ViewItemEvent product={productDetailsData} />

      <div className="productDetailsContainer container">
        <ProductMainContent productDetailsData={productDetailsData} />

        {productDetailsData?.product?.related_products?.length > 4 && (
          <ShopMore
            products={productDetailsData?.product?.related_products}
            sectionTitle="Customer Also bought"
          />
        )}

        {productDetailsData?.product?.cross_product?.length > 4 && (
          <ShopMore
            products={productDetailsData?.product?.cross_product}
            sectionTitle="You May Also Like"
          />
        )}

        {productDetailsData?.product?.most_viewed_product?.length && (
          <ShopMore
            products={productDetailsData?.product?.most_viewed_product}
            sectionTitle="Most Viewed Product"
          />
        )}
      </div>
    </>
  );
};

export default ProductDetailsPage;
