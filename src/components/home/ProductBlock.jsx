import BannerSection from "@/components/BannerSection";
import ProductCard from "@/components/shared/ProductCard";
import Link from "next/link";

const ProductBlock = ({ category }) => {
  return (
    <>
      {category.category_banner && (
        <BannerSection
          imageSrc={category.category_banner}
          mobileImageSrc={category.category_mobile_banner}
          title={category.name}
          buttonText="Shop Now"
          titleColor="#fff"
          href={`/category/${category.slug}`}
          promotionId={`category_banner_${category.id || category.slug}`}
          promotionName={`${category.name} Category Banner`}
          creativeName={category.name}
          creativeSlot="home_category_banner"
        />
      )}

      <div className={`container-xl px-3 px-sm-4 px-lg-5 ${category?.name && "mt-4 mb-5"}`}>
        <div className="temu-section-header mb-3">
          <h2 className="temu-section-title">{category.name}</h2>
          <Link href={`/category/${category.slug}`} className="temu-view-all">
            View All →
          </Link>
        </div>
        <div className="temu-product-grid">
          {category &&
            category?.category_products?.map((product, index) => (
              <ProductCard
                key={`${product.name}-${index}`}
                product={product}
                fill={true}
                isCritical={index < 5}
                index={index}
                itemListId={`category_${category.slug}`}
                itemListName={category.name}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default ProductBlock;
