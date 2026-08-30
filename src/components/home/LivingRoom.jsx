import React from "react";
import ProductCard from "@/components/shared/ProductCard";

const MyComponent = ({ data }) => {
  return (
    <div className="container">
      <div className="">
        {/* <h2 className={"p-b-32"}>Living room level-up-for less</h2> */}
      </div>
      <div className="row">
        {data && data.map((product, index) => (
          <div key={index} className="col-md-3 mb-4 small-product-card">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyComponent;
