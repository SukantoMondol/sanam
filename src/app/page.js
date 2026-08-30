import HomeComponent from "@/components/home/HomeComponent";
import { cache } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { headers } from "next/headers";

export async function generateMetadata() {
  try {
    const generalSettings = await getGeneralSettings();
    return {
      title: `Home | ${generalSettings?.default_page_title}`,
      description: generalSettings?.default_meta_description,
      robots: "index,follow",
      alternates: {
        canonical: process.env.NEXT_PUBLIC_APP_URL,
      },
      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_APP_URL}`,
        title: `${process.env.NEXT_PUBLIC_SITE_NAME} | Modern Furniture for Home & Office in Kuwait`,
        description: `Shop modern and stylish furniture in Kuwait at ${process.env.NEXT_PUBLIC_SITE_NAME}. Discover premium home and office furniture designed for comfort, quality, and smart space-saving solutions.`,
        siteName: process.env.NEXT_PUBLIC_SITE_NAME,
        images: [
          {
            url: `${generalSettings?.default_og_image}`,
            width: 1200,
            height: 630,
            alt: `${process.env.NEXT_PUBLIC_SITE_NAME} Open Graph Image`,
          },
        ],
      },
    };
  } catch {
    return {
      title: `Home | ${process.env.NEXT_PUBLIC_SITE_NAME || "Sanam Store"}`,
    };
  }
}

export const revalidate = 600; // Revalidate every 10 minutes

const getGeneralSettings = cache(async () => {
  try {
    const generalSettings = await axiosInstance.get(`/general-settings`);
    if (generalSettings?.data.status_code == 460) {
      console.warn("Home general settings returned 460; using fallback values");
      return {
        default_page_title:
          process.env.NEXT_PUBLIC_SITE_NAME || "Sanam Store",
        default_meta_description: `Shop modern and stylish furniture in Kuwait at ${
          process.env.NEXT_PUBLIC_SITE_NAME || "Sanam Store"
        }.`,
        logo: "/assets/images/logo.png",
        hotline_number: "",
      };
    }
    return generalSettings.data.data;
  } catch (error) {
    console.error("getGeneralSettings error:", error);
    return {
      default_page_title:
        process.env.NEXT_PUBLIC_SITE_NAME || "Sanam Store",
      default_meta_description: `Shop modern and stylish furniture in Kuwait at ${
        process.env.NEXT_PUBLIC_SITE_NAME || "Sanam Store"
      }.`,
      logo: "/assets/images/logo.png",
      hotline_number: "",
    };
  }
});

// Preload home data for parallel fetching
const preloadHomeData = cache(async () => {
  try {
    const homeData = await axiosInstance.get(`/home-page`);
    if (homeData?.data.status_code == 460) {
      throw new Error("404-Page Not Found");
    }
    return homeData.data.data;
  } catch (error) {
    console.error("HomeComponent preloadHomeData error:", error);
    return {
      banners: [],
      top_categories: [],
      block_categories: [],
      bottom_banner: null,
      testimonial: [],
    };
  }
});

export default async function Home() {
  // Parallel data fetching - both requests happen simultaneously
  const [generalSettings, homeData] = await Promise.all([
    getGeneralSettings(),
    preloadHomeData(),
  ]);

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for") ||
    requestHeaders.get("x-real-ip") ||
    "";
  const userAgent = requestHeaders.get("user-agent") || "";

  const sameAsLinks = [
    "https://www.facebook.com/sanamstore/",
    "https://x.com/sanamstore",
    "https://www.instagram.com/sanamstore/",
    "https://www.linkedin.com/company/sanamstore/",
    "https://www.youtube.com/@SanamStore",
    "https://www.pinterest.com/sanamstore/",
  ];

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: process.env.NEXT_PUBLIC_APP_URL,
    name: process.env.NEXT_PUBLIC_SITE_NAME,
    description: `${process.env.NEXT_PUBLIC_SITE_NAME} offers premium-quality furniture and home décor, combining style, comfort, and durability. We provide a wide range of modern, classic, and custom designs to enhance every living space.`,
    publisher: {
      "@type": "Organization",
      name: process.env.NEXT_PUBLIC_SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: generalSettings.logo,
      },
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: process.env.NEXT_PUBLIC_SITE_NAME,
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: {
      "@type": "ImageObject",
      url: generalSettings.logo,
    },
    image: "/assets/images/logo.png",
    email: "info@sanamstore.net",
    telephone: generalSettings?.hotline_number,
    address: {
      "@type": "PostalAddress",
      streetAddress: "House 789, West Kazi Para, Mirpur",
      addressLocality: "Kuwait",
      addressRegion: "Kuwait",
      postalCode: "1216",
      addressCountry: "BD",
    },
    sameAs: sameAsLinks,
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: "Sanam Store",
    image: generalSettings?.logo,
    "@id": process.env.NEXT_PUBLIC_APP_URL,
    url: process.env.NEXT_PUBLIC_APP_URL,
    telephone: generalSettings?.hotline_number,
    email: "info@sanamstore.net",
    priceRange: "KD KD ",
    address: {
      "@type": "PostalAddress",
      streetAddress: "House 789, West Kazi Para, Mirpur",
      addressLocality: "Kuwait",
      addressRegion: "Kuwait",
      postalCode: "1216",
      addressCountry: "BD",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 23.7907487,
      longitude: 90.4453202,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "22:00",
      },
    ],
    sameAs: sameAsLinks,
  };

  const breadCrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    name: "Breadcrumb List",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_APP_URL,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadCrumbSchema) }}
      />
      <HomeComponent data={homeData} />
    </>
  );
}