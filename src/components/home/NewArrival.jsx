import ProductCard from "@/components/shared/ProductCard";
import BannerSection from "@/components/BannerSection";
import { FaArrowRightLong } from "react-icons/fa6";

export default function NewArrival({ category }) {
  return (
    <>
      <BannerSection
        imageSrc="/assets/images/banner/banner1.png"
        title="holiday essentials for less"
        buttonText="Celebrate with Savings"
        titleColor="#fff"
      />
      <div className="container mt-100 ">
        <div className="new-arrivals-header">
          <h2 className={"p-b-32"}>
            {category.name}
            <small>
              <FaArrowRightLong />
            </small>
          </h2>
        </div>
        <div className="row">
          {category?.category_products?.map((product, index) => (
            <div key={index} className="col-md-3 mb-5">
              <ProductCard product={product} fill={true} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
