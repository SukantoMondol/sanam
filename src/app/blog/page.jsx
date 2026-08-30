import ImageComponent from "@/components/UI/Cards/ImageComponent";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";

export const metadata = {
  title: `Blog | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Read the latest articles, tips, and insights on furniture, décor, and home styling from ${process.env.NEXT_PUBLIC_SITE_NAME}.`,
  robots: "index,follow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
  },
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
    title: `Blog | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Explore our blog for expert advice, trends, and ideas on home décor and furniture.`,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: [
      {
        url: `/assets/images/og.webp`,
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_SITE_NAME} Blog Open Graph Image`,
      },
    ],
  },
};

const page = async () => {
  const fetchBlogPageData = async () => {
    try {
      const response = await axiosInstance.get("/blog-posts");

      return response?.data?.data;
    } catch (error) {
      console.warn("Failed to fetch blog page data:", error?.message);
      return { blog_posts: [] };
    }
  };

  const blogs = await fetchBlogPageData();

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${process.env.NEXT_PUBLIC_SITE_NAME} Blog`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
    description: `Read the latest articles, tips, and insights on furniture, décor, and home styling from ${process.env.NEXT_PUBLIC_SITE_NAME}.`,
    publisher: {
      "@type": "Organization",
      name: process.env.NEXT_PUBLIC_SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `/assets/images/logo.png`,
      },
    },
    blogPost: blogs?.blog_posts?.map((post) => ({
      "@type": "BlogPosting",
      headline: post?.title,
      image: post?.picture,
      description: post?.body_overview,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post?.id}`,
      datePublished: new Date(post?.created_at).toISOString(),
      dateModified: new Date(post?.updated_at).toISOString(),

      author: {
        "@type": "Organization",
        name: process.env.NEXT_PUBLIC_SITE_NAME,
        url: process.env.NEXT_PUBLIC_APP_URL,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post?.id}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <div className="blogPage container mb-4">
        <h1 className="text-center my-4">Blog</h1>

        <div className="d-flex flex-wrap justify-content-start gap-4">
          {blogs?.blog_posts?.map((post, index) => (
            <div
              key={post?.id}
              className="blogCard shadow d-flex flex-column justify-content-between gap-4"
            >
              <div>
                <ImageComponent
                  src={post?.picture}
                  height={192}
                  width={384}
                  alt={post?.title}
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "low"}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 384px"
                  className=""
                />
                <p className="my-3 pb-1 fs-5 blog-card-title">{post?.title}</p>

                <p className="blog-card-description">{post.body_overview}</p>
              </div>

              <Link href={`/blog/${post?.id}`}>View Details</Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default page;
