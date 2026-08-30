import ProductBlock from "@/components/home/ProductBlock";

const ProductBlockWrapper = ({ block_categories }) => {
  return (
    <>
      {block_categories &&
        block_categories
          .filter((category) => category.product_block_show !== false)
          .map((category) => (
          <div key={`${category.name}-${category.id}`}>
            {category.category_products.length >= 4 && (
              <ProductBlock category={category} />
            )}
          </div>
        ))}
    </>
  );
};

export default ProductBlockWrapper;
