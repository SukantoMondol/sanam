const LIVE_BACKEND = "https://kw.sanamstore.net";

function formatImageUrl(path) {
  if (!path) return "/assets/images/logo.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${LIVE_BACKEND}/${path.replace(/^\//, "")}`;
}

export async function fetchLiveHomeData() {
  try {
    const res = await fetch(`${LIVE_BACKEND}/api/iosv1/getHome`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Live API error ${res.status}`);
    }

    const json = await res.json();
    const data = json?.data || {};

    // 1. Map slideshow banners
    const banners = (data?.slideshow || []).map((slide, idx) => ({
      id: slide?.id || idx + 1,
      title: "Hero Banner",
      link: slide?.link || "/",
      image: formatImageUrl(slide?.image),
      mobile_image: formatImageUrl(slide?.image),
      button_text: "Shop Now",
    }));

    // 2. Map sections to product blocks
    const block_categories = (data?.sections || []).map((section) => {
      const products = (section?.items || []).map((item, pIdx) => {
        const retailPrice = Number(item?.retail_price) || 0;
        const oldPrice = Number(item?.old_price) || 0;
        const price = oldPrice > retailPrice ? oldPrice : retailPrice;
        const discount = oldPrice > retailPrice ? oldPrice - retailPrice : 0;

        return {
          id: item?.id || pIdx + 1,
          name: item?.title || "Product",
          title: item?.title || "Product",
          slug: String(item?.id || pIdx + 1),
          photo: formatImageUrl(item?.image),
          photo_alt: item?.title || "Product Image",
          price: {
            price: price,
            payable_price: retailPrice,
            discount: discount,
            discount_percentage: price > 0 ? Math.round((discount / price) * 100) : 0,
          },
          rating: 4.8,
          total_reviews: 15,
          stock_status: item?.is_stock > 0 ? "in_stock" : "out_of_stock",
          product_inventory: {
            stock: item?.is_stock || 10,
          },
        };
      });

      return {
        id: section?.id,
        name: section?.title || "Category",
        slug: String(section?.id),
        product_block_show: true,
        category_banner: null,
        category_mobile_banner: null,
        category_products: products,
      };
    });

    // 3. Bottom banner if available
    const bottom_banner = data?.banner?.[0]
      ? {
          id: data.banner[0].id,
          image: formatImageUrl(data.banner[0].image),
          link: data.banner[0].link || "/",
          title: "Promotional Banner",
        }
      : null;

    return {
      banners: banners,
      top_categories: [],
      block_categories: block_categories,
      bottom_banner: bottom_banner,
      testimonial: [],
      offertext: data?.offertext || "Same day delivery service if you order before 10 pm",
    };
  } catch (error) {
    console.error("fetchLiveHomeData error:", error);
    return {
      banners: [],
      top_categories: [],
      block_categories: [],
      bottom_banner: null,
      testimonial: [],
    };
  }
}

export async function fetchLiveCategories() {
  try {
    const res = await fetch(`${LIVE_BACKEND}/api/iosv1/getCategories`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      body: new URLSearchParams({ parent_id: "0" }).toString(),
      next: { revalidate: 600 },
    });

    if (!res.ok) throw new Error(`getCategories failed: ${res.status}`);

    const json = await res.json();
    const categories = (json?.data?.categories || []).map((cat) => ({
      id: cat?.id,
      name: cat?.title,
      slug: String(cat?.id),
      icon: formatImageUrl(cat?.image),
      image: formatImageUrl(cat?.image),
      children: (cat?.subcats || []).map((sub) => ({
        id: sub?.id,
        name: sub?.title,
        slug: String(sub?.id),
        children: [],
      })),
    }));

    return categories;
  } catch (error) {
    console.error("fetchLiveCategories error:", error);
    return [];
  }
}

export async function fetchLiveProductDetails(productIdOrSlug) {
  try {
    // Extract numeric ID if slug format like "123-product-name" or "123"
    const productId = String(productIdOrSlug).split("-")[0] || productIdOrSlug;

    const res = await fetch(`${LIVE_BACKEND}/api/iosv1/getProductDetails`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      body: new URLSearchParams({ product_id: String(productId) }).toString(),
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error(`getProductDetails failed: ${res.status}`);

    const json = await res.json();
    const details = json?.data?.productDetails;
    if (!details || !details.id) return null;

    const retailPrice = Number(details?.retail_price) || 0;
    const oldPrice = Number(details?.old_price) || 0;
    const price = oldPrice > retailPrice ? oldPrice : retailPrice;
    const discount = oldPrice > retailPrice ? oldPrice - retailPrice : 0;

    const gallery = [
      ...(details?.imageUrl_large ? [{ id: 1, photo: formatImageUrl(details.imageUrl_large) }] : []),
      ...(details?.gallery || []).map((g, idx) => ({
        id: idx + 2,
        photo: formatImageUrl(g?.image || g),
      })),
    ];

    return {
      product: {
        id: details?.id,
        name: details?.title,
        title: details?.title,
        slug: String(details?.id),
        sku: details?.item_code || details?.sku_no || `SKU-${details?.id}`,
        photo: formatImageUrl(details?.imageUrl_large || details?.imageUrl_small),
        photo_alt: details?.title,
        gallery: gallery,
        price: {
          price: price,
          payable_price: retailPrice,
          discount: discount,
          discount_percentage: price > 0 ? Math.round((discount / price) * 100) : 0,
        },
        description: details?.details || details?.details_ios || "",
        short_description: details?.title || "",
        product_inventory: {
          stock: Number(details?.quantity) || 10,
        },
        product_variations: [],
        rating: Number(details?.ratings) || 4.9,
        reviews_count: details?.reviews?.length || 5,
        seo: {
          title: details?.title,
          description: details?.title,
          og_image: formatImageUrl(details?.imageUrl_large),
        },
      },
      bread_crumb: [
        { name: "Home", slug: "/" },
        { name: details?.title || "Product", slug: `/product-details/${details?.id}` },
      ],
      related_products: [],
    };
  } catch (error) {
    console.error("fetchLiveProductDetails error:", error);
    return null;
  }
}
