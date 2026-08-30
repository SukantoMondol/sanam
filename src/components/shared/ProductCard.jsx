import CartHandler from "@/components/UI/Shared/CartHandler";
import { StarRating } from "../util/StarRating";
import ImageComponent from "../UI/Cards/ImageComponent";
import ProductSelectLink from "@/components/util/ProductSelectLink";

export default function ProductCard({
  product,
  sizes,
  fill,
  isCritical,
  width,
  height,
  index,
  itemListId,
  itemListName,
}) {
  const productUrl = `/product-details/${product?.slug}`;
  const formatPrice = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return "0.000 KWD";
    return `${Number(amount).toFixed(3)} KWD`;
  };

  const hasDiscount = product?.price?.discount != 0;
  const discountPercent = hasDiscount && product?.price?.price > 0
    ? Math.round(((product.price.price - product.price.payable_price) / product.price.price) * 100)
    : 0;

  return (
    <div className="temu-product-card">
      <ProductSelectLink
        href={productUrl}
        product={product}
        index={index}
        itemListId={itemListId}
        itemListName={itemListName}
      >
        <div className="temu-product-card__image">
          {product.photo && (
            <ImageComponent
              src={product.photo}
              alt={product.photo_alt || product.name}
              fill={true}
              className="temu-product-card__img"
              sizes={
                sizes
                  ? sizes
                  : "(max-width: 576px) 45vw, (max-width: 768px) 30vw, (max-width: 1200px) 20vw, 220px"
              }
              priority={isCritical}
              fetchPriority={isCritical ? "high" : "low"}
              loading={isCritical ? "eager" : "lazy"}
              {...(fill ? { fill: true } : { width: width, height: height })}
            />
          )}
          {hasDiscount && discountPercent > 0 && (
            <span className="temu-product-card__discount-badge">
              -{discountPercent}%
            </span>
          )}
        </div>
      </ProductSelectLink>

      <div className="temu-product-card__info">
        <ProductSelectLink
          href={productUrl}
          product={product}
          index={index}
          itemListId={itemListId}
          itemListName={itemListName}
        >
          <p className="temu-product-card__title">{product?.name}</p>
        </ProductSelectLink>

        <div className="temu-product-card__bottom">
          <div className="temu-product-card__price-row">
            <span className="temu-product-card__price">
              {formatPrice(product?.price?.payable_price)}
            </span>
            {product?.price?.payable_price !== product?.price?.price && (
              <span className="temu-product-card__old-price">
                {formatPrice(product?.price?.price)}
              </span>
            )}
          </div>

          {product?.review?.total_review > 0 && (
            <div className="temu-product-card__rating">
              <StarRating
                rating={product?.review?.average_rating}
                reviews={product?.review?.total_review}
              />
            </div>
          )}

          <div className="temu-product-card__cart-row">
            <CartHandler product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
