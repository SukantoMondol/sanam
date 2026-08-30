const Select = dynamic(() => import("react-select"), { ssr: false });
import dynamic from "next/dynamic";
import style from "./SelectInput.module.scss";

const SelectInput = ({
  state,
  setState,
  array,
  label,
  placeholder,
  required = false,
  id = "",
  error = "",
  border = true,
  ...rest
}) => {
  let errorMessage = "";
  if (error[id]) {
    errorMessage = (
      <p style={{ fontSize: "12px" }} className="text-danger mt-1">
        {error[id][0]}
      </p>
    );
  }

  return (
    <div {...rest} className={style.dropdown_container}>
      {label && (
        <label htmlFor="dropdown">
          {label} {required && <span className="text-danger">*</span>}{" "}
        </label>
      )}
      <Select
        id="dropdown"
        styles={{
          control: (base, state) => ({
            ...base,
            border: errorMessage
              ? "1px solid red"
              : "1px solid var(--grey-color6)",
            boxShadow: "none",
            "&:hover": {
              border: "1px solid var(--grey-color6)",
            },
          }),
        }}
        value={state}
        onChange={setState}
        options={array}
        placeholder={placeholder || "Select..."}
      />

      {/* Display the error message if it exists */}
      {errorMessage}
    </div>
  );
};

export default SelectInput;
