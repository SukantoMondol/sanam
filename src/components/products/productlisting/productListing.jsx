import Pagination from "@/components/shared/Pagination";
import ProductsFilterContainer from "./ProductsFilterContainer/ProductsFilterContainer";
import ProductCard from "@/components/shared/ProductCard";
import PriceRangeSlider from "./PriceRangeSlider/PriceRangeSlider";
import FilterSortBar from "./FilterSortBar";
import MobileFilterMenu from "./MobileFilterMenu";
import SearchBar from "@/components/shared/header/SearchBar";
import ImageComponent from "@/components/UI/Cards/ImageComponent";
import Link from "next/link";
import {Suspense} from "react";
import ViewItemListEvent from "@/components/util/ViewItemListEvent";

const ProductListing = ({ productsData }) => {
  const products = productsData?.products?.data || [];
  const itemListName =
    productsData?.category_name || productsData?.keyword || "Product Listing";

  return (
    <div className="product-listing-container">
      <ViewItemListEvent
        products={products}
        itemListId={productsData?.slug || itemListName}
        itemListName={itemListName}
      />

      <div className="filter d-lg-none d-flex justify-content-between align-items-center gap-3 gap-lg-4 mt-4">
        <SearchBar />
        <MobileFilterMenu productsData={productsData} categoryPage={true} />
      </div>

      {productsData?.sub_category?.length > 0 && (
        <div className="subcategory-wrapper my-4">
          <h5>Categories</h5>
          <div className="sub-category mt-3 d-flex gap-4 pb-3">
            {productsData?.sub_category?.map((subCategory) => (
              <Link
                href={`/category/${subCategory?.slug}`}
                key={subCategory?.id}
                className="d-flex flex-column align-items-center gap-2"
              >
                <ImageComponent
                  key={subCategory?.id}
                  sizes="(max-width: 576px) 90vw, (max-width: 768px) 45vw, 314px"
                  src={subCategory?.photo}
                  alt={subCategory?.name}
                  width={75}
                  height={75}
                  className=""
                />

                <span className="fw-medium">{subCategory?.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Filter Sort Bar */}
      <div className="d-none d-lg-block mt-4">
        <FilterSortBar />
      </div>

      <div className="row">
        {/* Filters Sidebar */}

        <div className="d-none d-lg-block col-lg-3">
          <PriceRangeSlider productsData={productsData} />
          <ProductsFilterContainer productsData={productsData} />
        </div>

        {/* Product Grid - 4 Columns */}
        <div className="col-12 col-lg-9">
          <div className="temu-category-product-grid p-1">
            {products.map((product, index) => (
              <ProductCard
                key={product?.id}
                sizes="(max-width: 576px) 45vw, (max-width: 768px) 30vw, (max-width: 1200px) 25vw, 250px"
                product={product}
                index={index}
                itemListId={productsData?.slug || itemListName}
                itemListName={itemListName}
                isCritical={index < 4}
                fill={true}
              />
            ))}
          </div>
            <Suspense fallback={<div>Loading...</div>}>
          <Pagination meta={productsData?.products?.meta} />
            </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
