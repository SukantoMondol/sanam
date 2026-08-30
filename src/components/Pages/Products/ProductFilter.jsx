import { useId } from "react";

const ProductFilter = ({ attribute, handleAttributeClick }) => {
  const uniqueId = useId();

  return (
    <div>
      <input
        onChange={(e) => handleAttributeClick(e.target.checked, attribute)}
        className="form-check-input"
        type="checkbox"
        id={`${uniqueId}-${attribute}`}
      />
      <label className="form-check-label" htmlFor={`${uniqueId}-${attribute}`}>
        {attribute}
      </label>
    </div>
  );
};

export default ProductFilter;
