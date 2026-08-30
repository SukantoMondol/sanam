export const GA4_ECOMMERCE_EVENTS = {
  VIEW_ITEM_LIST: "view_item_list",
  SELECT_ITEM: "select_item",
  VIEW_ITEM: "view_item",
  ADD_TO_CART: "add_to_cart",
  VIEW_CART: "view_cart",
  REMOVE_FROM_CART: "remove_from_cart",
  BEGIN_CHECKOUT: "begin_checkout",
  ADD_SHIPPING_INFO: "add_shipping_info",
  ADD_PAYMENT_INFO: "add_payment_info",
  PURCHASE: "purchase",
  VIEW_PROMOTION: "view_promotion",
  SELECT_PROMOTION: "select_promotion",
};

const DEFAULT_CURRENCY = "KWD";

const toNumber = (value, fallback = 0) => {
  if (typeof value === "object" && value !== null) {
    return fallback;
  }

  if (typeof value === "string") {
    value = value.replace(/[^\d.-]/g, "");
  }

  const number = parseFloat(value);
  return Number.isFinite(number) ? number : fallback;
};

const getProduct = (product) => product?.product || product || {};

const getProductPrice = (product) =>
  toNumber(
    product?.price?.payable_price ||
      product?.price?.discount_price ||
      product?.price?.sale_price ||
      product?.price?.regular_price ||
      product?.price?.price ||
      product?.payable_price ||
      product?.discount_price ||
      product?.sale_price ||
      product?.regular_price ||
      product?.unit_price ||
      product?.amount ||
      product?.price
  );

export function getGA4ProductPrice(productData, fallback) {
  const fallbackPrice = toNumber(fallback, NaN);

  if (Number.isFinite(fallbackPrice) && fallbackPrice > 0) {
    return fallbackPrice;
  }

  return getProductPrice(getProduct(productData));
}

const getProductVariant = (product, selectedVariation) => {
  const attributes =
    selectedVariation?.variation_attributes ||
    product?.product_variations?.[0]?.variation_attributes;

  if (!Array.isArray(attributes)) return undefined;

  const variant = attributes
    .map((attribute) => attribute?.value)
    .filter(Boolean)
    .join(", ");

  return variant || undefined;
};

const getCategoryName = (product, fallback) =>
  product?.category_name ||
  product?.category_names?.[0] ||
  product?.category?.name ||
  product?.product_category?.name ||
  product?.product_category_name ||
  product?.categories?.[0]?.name ||
  product?.categories?.[0]?.category_name ||
  fallback;

export function createGA4Item(productData, options = {}) {
  const product = getProduct(productData);
  const quantity = options.quantity || 1;
  const price = toNumber(options.price, getProductPrice(product));
  const item = {
    item_id: String(product?.id || product?.sku || options.item_id || ""),
    item_name: product?.name || options.item_name || "",
    item_brand: product?.brand?.name || options.item_brand || undefined,
    item_category: getCategoryName(product, options.item_category),
    item_variant: options.item_variant || getProductVariant(product, options.selectedVariation),
    price,
    quantity,
    google_business_vertical: "retail",
    ...options.itemParams,
  };

  Object.keys(item).forEach((key) => {
    if (item[key] === undefined || item[key] === null || item[key] === "") {
      delete item[key];
    }
  });

  return item;
}

export function createGA4CartItem(cartItem, options = {}) {
  const quantity = options.quantity || cartItem?.quantity || 1;
  const price = getGA4ProductPrice(
    {
      id: cartItem?.product_id || cartItem?.id,
      name: cartItem?.product_name || cartItem?.name,
      price: {
        payable_price: cartItem?.payable_price || cartItem?.unit_price,
      },
      category_name: cartItem?.category_name,
      category_names: cartItem?.category_names,
      category: cartItem?.category,
      product_category: cartItem?.product_category,
      product_category_name: cartItem?.product_category_name,
      categories: cartItem?.categories || cartItem?.product?.categories,
    },
    options.price || cartItem?.payable_price || cartItem?.unit_price
  );

  const item = {
    item_id: String(cartItem?.product_id || cartItem?.id || ""),
    item_name: cartItem?.product_name || cartItem?.name || "",
    item_category: getCategoryName(cartItem),
    item_variant:
      options.item_variant ||
      (Array.isArray(cartItem?.product_attributes)
        ? cartItem.product_attributes
            .map((attribute) => attribute?.value)
            .filter(Boolean)
            .join(", ")
        : undefined),
    price,
    quantity,
    google_business_vertical: "retail",
    ...options.itemParams,
  };

  Object.keys(item).forEach((key) => {
    if (item[key] === undefined || item[key] === null || item[key] === "") {
      delete item[key];
    }
  });

  return item;
}

export function createGA4CartEcommerce(cart, options = {}) {
  const items = (cart?.cart || []).map((item) => createGA4CartItem(item));
  const value = toNumber(
    options.value,
    cart?.summary?.total ||
      items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  return {
    currency: options.currency || DEFAULT_CURRENCY,
    value,
    items,
  };
}

export function pushGA4EcommerceEvent(event, ecommerce = {}) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event,
    ecommerce,
  });
}

function getCookieValue(name) {
  if (typeof document === "undefined") return null;

  const value =
    document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${name}=`))
      ?.split("=")
      .slice(1)
      .join("=") || null;

  return value ? decodeURIComponent(value) : null;
}

function setCookieValue(name, value) {
  if (typeof document === "undefined" || !value) return;

  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 2);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

function getStorageValue(name) {
  if (typeof window === "undefined") return null;

  return window.localStorage?.getItem(name) || window.sessionStorage?.getItem(name);
}

function getFbclid() {
  if (typeof window === "undefined") return null;

  return new URLSearchParams(window.location.search).get("fbclid");
}

function createFbp() {
  return `fb.1.${Date.now()}.${Math.floor(Math.random() * 10 ** 16)}`;
}

function getFbp() {
  const existing =
    getCookieValue("_fbp") || getCookieValue("fbp") || getStorageValue("_fbp");

  if (existing) return existing;

  const fbp = createFbp();
  setCookieValue("_fbp", fbp);
  return fbp;
}

function getFbc() {
  const existing =
    getCookieValue("_fbc") || getCookieValue("fbc") || getStorageValue("_fbc");

  if (existing) return existing;

  const fbclid = getFbclid();
  if (!fbclid) return null;

  const fbc = `fb.1.${Date.now()}.${fbclid}`;
  setCookieValue("_fbc", fbc);
  return fbc;
}

async function getClientIp(fallback) {
  if (fallback || typeof window === "undefined") return fallback || null;

  try {
    const response = await fetch("/api/client-ip", { cache: "no-store" });
    const data = await response.json();

    return data?.client_ip || null;
  } catch {
    return null;
  }
}

const cleanObject = (object) => {
  Object.keys(object).forEach((key) => {
    if (object[key] === undefined || object[key] === null || object[key] === "") {
      delete object[key];
    }
  });

  return object;
};

const formatAddress = (address) => {
  if (typeof address === "string") return address;

  if (!address || typeof address !== "object") return undefined;

  return [
    address.street_address,
    address.zone_name || address.zone,
    address.city_name || address.city,
    address.division_name || address.division,
  ]
    .filter(Boolean)
    .join(", ");
};

const getArea = (address) => {
  if (typeof address === "string") return undefined;

  if (!address || typeof address !== "object") return undefined;

  return [address.zone_name || address.zone, address.city_name || address.city]
    .filter(Boolean)
    .join(", ");
};

const createPurchaseUserData = (customer = {}) => ({
  customer_id: String(
    customer.customer_id ||
      customer.user_id ||
      customer.userId ||
      customer.id ||
      ""
  ),
  name: customer.name || customer.customer_name || null,
  phone: customer.phone || customer.customer_phone || null,
  address: formatAddress(customer.address) || customer.address || null,
  area: customer.area || getArea(customer.address) || null,
  fbp: customer.fbp || getFbp(),
  fbc: customer.fbc || getFbc(),
  client_ip: customer.client_ip || customer.clientIp || null,
});

const createPurchaseOrderInfo = (options = {}, ecommerce = {}) => {
  const itemCount = ecommerce.items?.reduce(
    (sum, item) => sum + toNumber(item.quantity, 0),
    0
  );

  return {
    invoice_id: String(options.invoiceId || options.transactionId || ""),
    order_id: String(options.orderId || options.order_id || options.transactionId || ""),
    payment_method: options.paymentMethod || options.paymentType || null,
    payment_status: options.paymentStatus || "pending",
    grand_total: toNumber(options.grandTotal, ecommerce.value),
    shipping: toNumber(options.shipping),
    discount: toNumber(options.discount),
    coupon: options.coupon || null,
    item_count: itemCount,
  };
};

async function pushPurchaseEvent(ecommerce = {}, options = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const customer = {
    ...options.customer,
    client_ip: await getClientIp(
      options.customer?.client_ip || options.customer?.clientIp
    ),
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: GA4_ECOMMERCE_EVENTS.PURCHASE,
    ecommerce: {
      transaction_id: String(options.transactionId || ""),
      value: toNumber(options.value, ecommerce.value),
      tax: toNumber(options.tax),
      shipping: toNumber(options.shipping),
      currency: options.currency || ecommerce.currency || DEFAULT_CURRENCY,
      coupon: options.coupon || null,
      payment_method: options.paymentMethod || options.paymentType || null,
      items: ecommerce.items || [],
    },
    user_data: createPurchaseUserData(customer),
    order_info: createPurchaseOrderInfo(options, {
      ...ecommerce,
      value: toNumber(options.value, ecommerce.value),
    }),
  });
}

function createPromotionEcommerce(options = {}) {
  return cleanObject({
    creative_name: options.creativeName,
    creative_slot: options.creativeSlot,
    promotion_id: options.promotionId,
    promotion_name: options.promotionName,
    items: options.items || [],
  });
}

export function trackViewPromotion(options = {}) {
  const ecommerce = createPromotionEcommerce(options);

  pushGA4EcommerceEvent(GA4_ECOMMERCE_EVENTS.VIEW_PROMOTION, ecommerce);
}

export function trackSelectPromotion(options = {}) {
  const ecommerce = createPromotionEcommerce(options);

  pushGA4EcommerceEvent(GA4_ECOMMERCE_EVENTS.SELECT_PROMOTION, ecommerce);
}

export function trackViewItem(productData, options = {}) {
  const item = createGA4Item(productData, options);
  const value = toNumber(options.value, item.price * (item.quantity || 1));

  pushGA4EcommerceEvent(GA4_ECOMMERCE_EVENTS.VIEW_ITEM, {
    currency: options.currency || DEFAULT_CURRENCY,
    value,
    items: [item],
  });
}

export function trackViewItemList(products = [], options = {}) {
  if (!Array.isArray(products) || products.length === 0) {
    return;
  }

  const items = products.map((product, index) =>
    createGA4Item(product, {
      quantity: 1,
      itemParams: {
        index,
        item_list_id: options.itemListId,
        item_list_name: options.itemListName,
      },
    })
  );

  pushGA4EcommerceEvent(GA4_ECOMMERCE_EVENTS.VIEW_ITEM_LIST, {
    item_list_id: options.itemListId,
    item_list_name: options.itemListName,
    items,
  });
}

export function trackSelectItem(productData, options = {}) {
  const item = createGA4Item(productData, {
    quantity: 1,
    itemParams: {
      index: options.index,
      item_list_id: options.itemListId,
      item_list_name: options.itemListName,
    },
  });

  pushGA4EcommerceEvent(GA4_ECOMMERCE_EVENTS.SELECT_ITEM, {
    item_list_id: options.itemListId,
    item_list_name: options.itemListName,
    items: [item],
  });
}

export function trackAddToCart(productData, options = {}) {
  const quantity = options.quantity || 1;
  const price = getGA4ProductPrice(productData, options.price);
  const item = createGA4Item(productData, {
    quantity,
    price,
    selectedVariation: options.selectedVariation,
    itemParams: options.itemParams,
  });
  const value = toNumber(options.value, price * quantity);

  pushGA4EcommerceEvent(GA4_ECOMMERCE_EVENTS.ADD_TO_CART, {
    currency: options.currency || DEFAULT_CURRENCY,
    value,
    items: [item],
  });
}

export function trackViewCart(cart, options = {}) {
  const ecommerce = createGA4CartEcommerce(cart, options);
  if (ecommerce.items.length === 0) return;

  pushGA4EcommerceEvent(GA4_ECOMMERCE_EVENTS.VIEW_CART, ecommerce);
}

export function trackRemoveFromCart(cartItem, options = {}) {
  const item = createGA4CartItem(cartItem, options);
  const value = toNumber(options.value, item.price * item.quantity);

  pushGA4EcommerceEvent(GA4_ECOMMERCE_EVENTS.REMOVE_FROM_CART, {
    currency: options.currency || DEFAULT_CURRENCY,
    value,
    items: [item],
  });
}

export function trackClearCart(cart, options = {}) {
  const ecommerce = createGA4CartEcommerce(cart, options);
  if (ecommerce.items.length === 0) return;

  pushGA4EcommerceEvent(GA4_ECOMMERCE_EVENTS.REMOVE_FROM_CART, ecommerce);
}

export function trackBeginCheckout(cart, options = {}) {
  const ecommerce = createGA4CartEcommerce(cart, options);
  if (ecommerce.items.length === 0) return;

  pushGA4EcommerceEvent(GA4_ECOMMERCE_EVENTS.BEGIN_CHECKOUT, ecommerce);
}

export function trackSingleProductBeginCheckout(productData, options = {}) {
  const quantity = options.quantity || 1;
  const price = getGA4ProductPrice(productData, options.price);
  const item = createGA4Item(productData, {
    quantity,
    price,
    selectedVariation: options.selectedVariation,
  });
  const value = toNumber(options.value, price * quantity);

  pushGA4EcommerceEvent(GA4_ECOMMERCE_EVENTS.BEGIN_CHECKOUT, {
    currency: options.currency || DEFAULT_CURRENCY,
    value,
    items: [item],
  });
}

export function trackAddShippingInfo(cart, options = {}) {
  const ecommerce = createGA4CartEcommerce(cart, options);
  if (ecommerce.items.length === 0) return;

  pushGA4EcommerceEvent(GA4_ECOMMERCE_EVENTS.ADD_SHIPPING_INFO, {
    ...ecommerce,
    shipping_tier: options.shippingTier,
  });
}

export function trackAddPaymentInfo(cart, options = {}) {
  const ecommerce = createGA4CartEcommerce(cart, options);
  if (ecommerce.items.length === 0) return;

  pushGA4EcommerceEvent(GA4_ECOMMERCE_EVENTS.ADD_PAYMENT_INFO, {
    ...ecommerce,
    payment_type: options.paymentType,
  });
}

export async function trackPurchase(cart, options = {}) {
  const ecommerce = createGA4CartEcommerce(cart, options);
  if (ecommerce.items.length === 0) return;

  await pushPurchaseEvent(ecommerce, options);
}

export async function trackSingleProductPurchase(productData, options = {}) {
  const quantity = options.quantity || 1;
  const price = getGA4ProductPrice(productData, options.price);
  const item = createGA4Item(productData, {
    quantity,
    price,
    selectedVariation: options.selectedVariation,
  });
  const value = toNumber(options.value, price * quantity);

  await pushPurchaseEvent(
    {
      currency: options.currency || DEFAULT_CURRENCY,
      value,
      items: [item],
    },
    options
  );
}

/**
 * payment_initiated — fires when customer clicks "Proceed to Payment"
 * on the Order Confirmation page.
 *
 * GTM Custom Event : payment_initiated
 * Facebook Pixel   : InitiateCheckout
 */
export function trackPaymentInitiated(options = {}) {
  if (typeof window === "undefined") return;

  const value = toNumber(options.value);
  const currency = options.currency || DEFAULT_CURRENCY;
  const invoiceNo = options.invoiceNo || options.invoice_no || "";

  // ── GTM / GA4 dataLayer push ──────────────────────────────────────────────
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null }); // clear previous ecommerce data
  window.dataLayer.push({
    event: "payment_initiated",
    ecommerce: {
      currency,
      value,
      invoice_no: invoiceNo,
      payment_method: options.paymentMethod || null,
    },
  });

  // ── Facebook Pixel ────────────────────────────────────────────────────────
  if (typeof window.fbq === "function") {
    window.fbq("track", "InitiateCheckout", {
      value,
      currency,
      content_ids: invoiceNo ? [invoiceNo] : undefined,
    });
  }
}

/**
 * payment_complete — fires when customer successfully confirms payment
 * on the bKash / SSLCommerz redirect-back page.
 *
 * GTM Custom Event : payment_complete
 * Facebook Pixel   : Purchase
 */
export function trackPaymentComplete(options = {}) {
  if (typeof window === "undefined") return;

  const value = toNumber(options.value);
  const currency = options.currency || DEFAULT_CURRENCY;
  const invoiceNo = options.invoiceNo || options.invoice_no || "";
  const paymentMethod = options.paymentMethod || "online";

  // ── GTM / GA4 dataLayer push ──────────────────────────────────────────────
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null }); // clear previous ecommerce data
  window.dataLayer.push({
    event: "payment_complete",
    ecommerce: {
      transaction_id: invoiceNo,
      value,
      currency,
      payment_method: paymentMethod,
      shipping: toNumber(options.shipping),
      discount: toNumber(options.discount),
    },
  });

  // ── Facebook Pixel ────────────────────────────────────────────────────────
  if (typeof window.fbq === "function") {
    window.fbq("track", "Purchase", {
      value,
      currency,
      content_ids: invoiceNo ? [invoiceNo] : undefined,
      content_type: "product",
    });
  }
}

/**
 * trackSearch — fires when customer searches for a product.
 *
 * Triggered:
 *   1. When customer presses Enter or clicks Search button (form submit)
 *   2. When customer clicks a suggestion from the dropdown
 *
 * GTM Custom Event : search
 * Facebook Pixel   : Search
 */
export function trackSearch(searchTerm = "") {
  if (typeof window === "undefined") return;
  if (!searchTerm) return;

  // ── GTM / GA4 dataLayer push ────────────────────────────────────────────
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "search",
    search_term: searchTerm,
  });

  // ── Facebook Pixel ──────────────────────────────────────────────────────
  if (typeof window.fbq === "function") {
    window.fbq("track", "Search", {
      search_string: searchTerm,
    });
  }
}
