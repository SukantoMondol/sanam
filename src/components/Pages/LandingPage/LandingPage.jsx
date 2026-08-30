import axiosInstance from "@/utils/axiosInstance";
import Breadcrumb from "../../UI/Shared/Breadcrumb";
import SearchBar from "../../shared/header/SearchBar";
import FilterSortBar from "../../products/productlisting/FilterSortBar";
import ProductViewPanel from "../ProductDetails/ProductViewPanel";
import ProductCard from "../../shared/ProductCard";
import { Pagination } from "react-bootstrap";

const fetchProductDetailsPageData = async (slug) => {
  try {
    const response = await axiosInstance.get(`/product-details/${slug}`);
    if (
      response?.data.status_code == 460 ||
      response?.data.status_code == 404
    ) {
      //   notFound();
      throw new Error("404-Page Not Found");
    }
    return response?.data?.data;
  } catch (error) {
    // notFound();
    throw new Error(error?.message);
  }
};

const fetchCategoryPageData = async (slug, searchParams) => {
  try {
    const response = await axiosInstance.get(
      `/get-products-by-category/${slug}`,
      { params: searchParams }
    );
    return response?.data?.data;
  } catch (error) {
    throw new Error(error?.message);
  }
};

const LandingPage = async ({ params, searchParams }) => {
  const productDetailsData = await fetchProductDetailsPageData(params?.slug);

  const categoryPageData = await fetchCategoryPageData(
    productDetailsData?.product?.landing_page_category
      ? productDetailsData?.product?.landing_page_category
      : productDetailsData?.product?.categories[0]?.slug,
    searchParams
  );

  return (
    <div className="container landingPage">
      <Breadcrumb
        items={[
          ...productDetailsData?.bread_crumb?.map((item) => ({
            label: item?.name,
            href: `/category/${item?.slug}`,
          })),
        ]}
      />

      <>
        {/* Filter Sort Bar */}
        <div className="mt-4 d-none d-lg-block">
          <FilterSortBar productsData={categoryPageData} />
        </div>

        <div className="my-4">
          {/* Mobile filters and search */}
          {/* <div className="d-xxl-none mb-4"> */}
          <div className="d-none mb-4">
            <div className="d-block d-lg-none">
              <SearchBar />
            </div>
          </div>

          {/* Main Product Detail Panel */}
          <div>
            <ProductViewPanel
              productDetailsData={productDetailsData}
              isLandingPage={true}
            />

            {/* Products */}
            <div className="my-4 my-xxl-5">
              <div className="row g-4 px-0">
                {categoryPageData?.products?.data?.map((product) => (
                  <div
                    key={product?.id}
                    className={`col-12 col-md-${6} col-lg-${4} col-xxl-${3}`}
                  >
                    <ProductCard product={product} fill={true} />
                  </div>
                ))}
              </div>

              <Pagination meta={categoryPageData?.products?.meta} />
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default LandingPage;
