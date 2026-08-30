import ShopMoreCard from "@/components/UI/Cards/ShopMoreCard";

const ShopMore = ({ sectionTitle, products }) => {
  return (
    <div className="shopMoreSection">
      <h2 className="sectionTitle">{sectionTitle}</h2>

      <div className="productsContainer">
        {products?.map((product) => (
          <ShopMoreCard product={product} key={product?.id} />
        ))}
      </div>
    </div>
  );
};

export default ShopMore;
