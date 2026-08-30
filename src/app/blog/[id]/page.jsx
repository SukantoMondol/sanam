import ImageComponent from "@/components/UI/Cards/ImageComponent";
import axiosInstance from "@/utils/axiosInstance";
import { cache } from "react";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await fetchBlogDetailsPageData(id);

  return {
    title: `${blog?.title} | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: blog?.body_overview,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${id}`,
    },
    robots: "index, follow",
    keywords: blog?.seo?.keywords,
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${id}`,
      title: `${blog?.title}`,
      description: blog?.body_overview,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME,
      images: [
        {
          url: `${blog?.seo?.og_image}`,
          width: 1200,
          height: 630,
          alt: blog?.title,
        },
      ],
    },
  };
}

const fetchBlogDetailsPageData = cache(async (id) => {
  try {
    const response = await axiosInstance.get(`/blog-posts/${id}`);
    return response?.data?.data;
  } catch (error) {
    throw new Error(error?.message);
  }
});

const BlogDetailsPage = async ({ params }) => {
  const { id } = await params;
  const blog = await fetchBlogDetailsPageData(id);

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog?.seo?.title,
    description: blog?.seo?.description,
    image: blog?.picture,
    author: {
      "@type": "Organization",
      name: process.env.NEXT_PUBLIC_SITE_NAME,
      url: process.env.NEXT_PUBLIC_APP_URL,
    },
    publisher: {
      "@type": "Organization",
      name: process.env.NEXT_PUBLIC_SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `/assets/images/logo.png`,
      },
    },
    datePublished: new Date(blog?.created_at).toISOString(),
    dateModified: new Date(blog?.updated_at).toISOString(),
    mainEntityOfPage: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog?.slug}`,
    wordCount: blog?.body_overview?.split(" ")?.length,
    keywords: blog?.seo?.keywords,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    name: "Breadcrumb",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_APP_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog?.title,
        item: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog?.id}`,
      },
    ],
  };

  return (
    <>
      {/* BlogPosting JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />

      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="blogDetailsPage container my-4 p-4">
        <h1 className="mb-4">{blog?.title}</h1>

        <ImageComponent
          src={blog?.picture}
          height={440}
          width={1552}
          alt={blog?.title}
          className=""
          priority
          fetchPriority="high"
          loading="eager"
          sizes="(max-width: 768px) 100vw, 1552px"
        />

        <div
          className="mt-4 details"
          dangerouslySetInnerHTML={{ __html: blog?.body }}
        />

        <div className="mt-4 d-flex justify-content-between">
          <p>Created At: {blog?.created_at}</p>
          <p>Updated At: {blog?.updated_at}</p>
        </div>
      </div>
    </>
  );
};

export default BlogDetailsPage;
