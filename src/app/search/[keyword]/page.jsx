import SearchClient from "./SearchClient";

export async function generateMetadata({ params }) {
  const keyword = await params?.keyword;

  return {
    title: `Search results for "${keyword}" | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Discover premium furniture and décor related to "${keyword}" at ${process.env.NEXT_PUBLIC_SITE_NAME}. Find quality products to beautify your home or office.`,
    robots: "index,follow",
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_APP_URL
      }/search/${encodeURIComponent(keyword)}`,
    },
    openGraph: {
      title: `Search results for "${keyword}" | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
      description: `Discover premium furniture and décor related to "${keyword}" at ${process.env.NEXT_PUBLIC_SITE_NAME}. Find quality products to beautify your home or office.`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/search/${encodeURIComponent(
        keyword
      )}`,
      type: "website",
      siteName: process.env.NEXT_PUBLIC_SITE_NAME,
      images: [
        {
          url: `/assets/images/og.webp`,
          width: 1200,
          height: 630,
          alt: `Search results for ${keyword}`,
        },
      ],
    },
  };
}

const SearchPage = async ({ params, searchParams }) => {
  const resolvedParams = await params;
  const keyword = resolvedParams?.keyword || null;
  // pass raw searchParams entries to client
  const clientSearchParams = {};
  if (searchParams && typeof searchParams.entries === "function") {
    for (const [k, v] of searchParams.entries()) {
      clientSearchParams[k] = v;
    }
  }

  const searchResultsSchema = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/search/${encodeURIComponent(
      await params?.keyword
    )}`,
    name: `Search results for "${await params?.keyword}"`,
    description: `Discover premium furniture and décor related to "${await params?.keyword}" at ${
      process.env.NEXT_PUBLIC_SITE_NAME
    }. Find quality products to beautify your home or office.`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(searchResultsSchema),
        }}
      />

      <div className="searchPage container">
        <h1 className="d-none">Search results for "{await params.keyword}"</h1>

        <SearchClient keyword={keyword} searchParams={clientSearchParams} />
      </div>
    </>
  );
};

export default SearchPage;
