import MobileFilterMenu from "./MobileFilterMenu";

const FilterSortBar = ({ productsData }) => {
  return (
    <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center px-3 px-sm-4 py-3 rounded-1 bg-light-gray mb-4">
      {productsData ? (
        <MobileFilterMenu productsData={productsData} />
      ) : (
        <button className="btn btn-outline-secondary">Filter</button>
      )}

      <select aria-label="Sort products" className="form-select w-auto">
        <option>Featured</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
      </select>
    </div>
  );
};

export default FilterSortBar;
