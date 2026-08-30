import { StarRating } from "@/components/util/StarRating";
import ImageComponent from "./ImageComponent";
import AddToCartButton from "../Shared/AddToCartButton";
import Link from "next/link";

const ShopMoreCard = ({ product }) => {
  return (
    <div key={product?.id} className="shopMoreCard">
      <Link
        href={`/product-details/${product?.slug}`}
        className="productImageWrapper"
      >
        {product?.price?.discount ? (
          <span className="sale-badge">Sale</span>
        ) : (
          ""
        )}
        <ImageComponent
          src={product?.photo}
          height={366}
          width={366}
          alt={product?.name}
          sizes="(max-width: 576px) 90vw, (max-width: 768px) 45vw, 366px"
        />
      </Link>

      <Link href={`/product-details/${product?.slug}`}>
        <p className="productTitle">{product?.name}</p>
      </Link>

      <div className="shopMoreCardInfo">
        <div>
          <div className="priceContainer">
            <span>KD {product?.price?.payable_price?.toFixed(2)}</span>
            <span>KD {product?.price?.price?.toFixed(2)}</span>
          </div>
        </div>
        {product?.review?.total_review > 0 && (
          <StarRating
            rating={product?.rating?.average_rating ?? 0}
            reviews={product?.review?.total_review}
          />
        )}
        <AddToCartButton product={product} />
      </div>
    </div>
  );
};

export default ShopMoreCard;
