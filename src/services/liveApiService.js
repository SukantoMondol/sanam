import fallbackHomeData from "@/data/liveHomeData.json";
import fallbackCategories from "@/data/liveCategories.json";

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
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return fallbackHomeData;
    }

    const json = await res.json();
    const data = json?.data || {};

    if (!data?.sections || data.sections.length === 0) {
      return fallbackHomeData;
    }

    // 1. Map slideshow banners
    const banners = (data?.slideshow || []).map((slide, idx) => ({
      id: slide?.id || idx + 1,
      title: "Hero Banner",
      link: slide?.link || "/",
      url: slide?.link || "/",
      image: formatImageUrl(slide?.image),
      picture: formatImageUrl(slide?.image),
      mobile_image: formatImageUrl(slide?.image),
      mobile_picture: formatImageUrl(slide?.image),
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
          image: formatImageUrl(item?.image),
          photo_alt: item?.title || "Product Image",
          price: {
            price: price,
            payable_price: retailPrice,
            discount: discount,
            discount_percentage: price > 0 ? Math.round((discount / price) * 100) : 0,
          },
          rating: 4.8,
          review: {
            average_rating: 4.8,
            total_review: 15,
          },
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

    // 3. Bottom banner
    const bottom_banner = data?.banner?.[0]
      ? {
          id: data.banner[0].id,
          image: formatImageUrl(data.banner[0].image),
          link: data.banner[0].link || "/",
          title: "Promotional Banner",
        }
      : null;

    return {
      banners: banners.length > 0 ? banners : fallbackHomeData.banners,
      top_categories: [],
      block_categories: block_categories.length > 0 ? block_categories : fallbackHomeData.block_categories,
      bottom_banner: bottom_banner || fallbackHomeData.bottom_banner,
      testimonial: [],
      offertext: data?.offertext || "Same day delivery service if you order before 10 pm",
    };
  } catch (error) {
    return fallbackHomeData;
  }
}

export async function fetchLiveCategories() {
  try {
    const res = await fetch(`${LIVE_BACKEND}/api/iosv1/getCategories`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: new URLSearchParams({ parent_id: "0" }).toString(),
      next: { revalidate: 300 },
    });

    if (!res.ok) return fallbackCategories;

    const json = await res.json();
    const categories = (json?.data?.categories || []).map((cat) => ({
      id: cat?.id,
      name: cat?.title,
      slug: String(cat?.id),
      icon: formatImageUrl(cat?.image),
      image: formatImageUrl(cat?.image),
      picture: formatImageUrl(cat?.image),
      children: (cat?.subcats || []).map((sub) => ({
        id: sub?.id,
        name: sub?.title,
        slug: String(sub?.id),
        picture: formatImageUrl(sub?.image),
        children: [],
      })),
    }));

    return categories.length > 0 ? categories : fallbackCategories;
  } catch (error) {
    return fallbackCategories;
  }
}

export async function fetchLiveCategoryProducts(catIdOrSlug, queryParams = {}) {
  try {
    let catId = catIdOrSlug;
    if (isNaN(Number(catIdOrSlug))) {
      const categories = await fetchLiveCategories();
      const matched = categories.find(
        (c) =>
          c.name.toLowerCase() === String(catIdOrSlug).replace(/-/g, " ").toLowerCase()
      );
      catId = matched?.id || 70;
    }

    const res = await fetch(`${LIVE_BACKEND}/api/iosv1/getProducts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: new URLSearchParams({ cat_id: String(catId) }).toString(),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      // Return products from fallback sections
      const matchingSection = fallbackHomeData.block_categories.find(
        (s) => String(s.id) === String(catId)
      );
      const fallbackProds = matchingSection?.category_products || fallbackHomeData.block_categories[0].category_products;
      return {
        category_name: matchingSection?.name || "Products",
        products: fallbackProds,
        pagination: { total: fallbackProds.length, current_page: 1, last_page: 1 },
        bread_crumb: [
          { name: "Home", slug: "/" },
          { name: matchingSection?.name || "Category", slug: `/category/${catId}` },
        ],
      };
    }

    const json = await res.json();
    const productLists = json?.data?.productLists || [];

    const formattedProducts = productLists.map((item, idx) => {
      const retailPrice = Number(item?.retail_price) || 0;
      const oldPrice = Number(item?.old_price) || 0;
      const price = oldPrice > retailPrice ? oldPrice : retailPrice;
      const discount = oldPrice > retailPrice ? oldPrice - retailPrice : 0;

      return {
        id: item?.id || idx + 1,
        name: item?.title,
        title: item?.title,
        slug: String(item?.id || idx + 1),
        photo: formatImageUrl(item?.image),
        image: formatImageUrl(item?.image),
        photo_alt: item?.title,
        price: {
          price: price,
          payable_price: retailPrice,
          discount: discount,
          discount_percentage: price > 0 ? Math.round((discount / price) * 100) : 0,
        },
        rating: 4.8,
        review: {
          average_rating: 4.8,
          total_review: 12,
        },
        stock_status: item?.is_stock > 0 ? "in_stock" : "out_of_stock",
      };
    });

    return {
      category_name: "Products",
      products: formattedProducts,
      pagination: {
        total: formattedProducts.length,
        current_page: 1,
        last_page: 1,
      },
      bread_crumb: [
        { name: "Home", slug: "/" },
        { name: "Category", slug: `/category/${catId}` },
      ],
    };
  } catch (error) {
    const fallbackProds = fallbackHomeData.block_categories[0].category_products;
    return {
      category_name: "Products",
      products: fallbackProds,
      pagination: { total: fallbackProds.length, current_page: 1, last_page: 1 },
      bread_crumb: [{ name: "Home", slug: "/" }],
    };
  }
}

export async function fetchLiveProductDetails(productIdOrSlug) {
  try {
    let productId = productIdOrSlug;

    if (isNaN(Number(productIdOrSlug))) {
      const match = String(productIdOrSlug).match(/^(\d+)/);
      if (match) {
        productId = match[1];
      } else {
        // Find in fallback catalog first
        for (const sec of fallbackHomeData.block_categories) {
          const found = sec.category_products.find(
            (p) =>
              p.name.toLowerCase().includes(String(productIdOrSlug).replace(/-/g, " ").toLowerCase()) ||
              String(productIdOrSlug).toLowerCase().includes(p.name.toLowerCase())
          );
          if (found) {
            productId = found.id;
            break;
          }
        }
        if (!productId || isNaN(Number(productId))) {
          productId = 4497;
        }
      }
    }

    const res = await fetch(`${LIVE_BACKEND}/api/iosv1/getProductDetails`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: new URLSearchParams({ product_id: String(productId) }).toString(),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      // Find fallback product
      let fallbackProd = null;
      for (const sec of fallbackHomeData.block_categories) {
        fallbackProd = sec.category_products.find((p) => String(p.id) === String(productId));
        if (fallbackProd) break;
      }
      if (!fallbackProd) fallbackProd = fallbackHomeData.block_categories[0].category_products[0];

      return {
        product: {
          id: fallbackProd.id,
          name: fallbackProd.name,
          title: fallbackProd.name,
          slug: String(fallbackProd.id),
          sku: `SKU-${fallbackProd.id}`,
          photo: fallbackProd.photo,
          photo_alt: fallbackProd.name,
          gallery: [{ id: 1, photo: fallbackProd.photo }],
          price: fallbackProd.price,
          description: fallbackProd.name,
          short_description: fallbackProd.name,
          product_inventory: { stock: 10 },
          product_variations: [],
          rating: 4.8,
          reviews_count: 15,
          seo: {
            title: fallbackProd.name,
            description: fallbackProd.name,
            og_image: fallbackProd.photo,
          },
        },
        bread_crumb: [
          { name: "Home", slug: "/" },
          { name: fallbackProd.name, slug: `/product-details/${fallbackProd.id}` },
        ],
        related_products: [],
      };
    }

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
        gallery: gallery.length > 0 ? gallery : [{ id: 1, photo: formatImageUrl(details?.imageUrl_small) }],
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
