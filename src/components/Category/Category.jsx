import ProductListing from "@/components/products/productlisting/productListing";
import CategoryShowcase from "@/components/products/categoryshowcase/CategoryShowcase";
import TopPicks from "@/components/Pages/Products/TopPicks";
import Categories from "@/components/products/categories/Categories";
import Breadcrumb from "../UI/Shared/Breadcrumb";

const Category = async ({ productsData }) => {
  // Encode query parameters
  // const encodedQueryParams = Object.fromEntries(
  //   Object.entries(queryParams).map(([key, value]) => [
  //     key?.toString(),
  // encodeURIComponent(value?.toString()),
  //   ])
  // );

  return (
    <>
      <h1 className="d-none">{productsData?.category_name}</h1>
      <Breadcrumb
        items={(productsData?.bread_crumb || []).map((item) => ({
          label: item?.name,
          href: item?.slug ? `/category/${item?.slug}` : "/",
        }))}
      />

      <div className="container">
        {/* <Categories /> */}
        <ProductListing productsData={productsData} />
        {/* <TopPicks /> */}
        {/*<CategoryShowcase/>*/}
      </div>
    </>
  );
};

export default Category;
