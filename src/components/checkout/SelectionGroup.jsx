const SelectionGroup = ({
  title,
  options,
  selectedOption,
  setSelectedOption,
}) => {
  return (
    <div className="mb-lg-4 mb-3 mt-5">
      <label className="form-label fw-semibold fs-4 text-center d-block pb-3 pb-lg-4 border-bottom title">
        {title}
      </label>
      <div className="shipping-form">
        {options?.map((option) => (
          <div
            key={option}
            className="form-check mb-2 p-3 rounded d-flex align-items-center"
          >
            <input
              type="radio"
              id={option}
              name={option}
              className="form-check-input"
              checked={option?.includes(selectedOption)}
              onChange={() => setSelectedOption(option)}
            />

            <label className="form-check-label cursor-pointer" htmlFor={option}>
              {option?.charAt(0)?.toUpperCase() +
                option?.slice(1).split("_")?.join(" ")?.split("-")?.join(" - ")}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectionGroup;
