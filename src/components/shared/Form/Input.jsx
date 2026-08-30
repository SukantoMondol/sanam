const Input = ({
  type = "text",
  register,
  errorMessage = "",
  id,
  className,
  placeholder,
  disabled = false,
  defaultValue,
}) => {
  return (
    <div className="inputContainer">
      <input
        id={id}
        type={type}
        {...register}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        defaultValue={defaultValue}
      />

      {errorMessage[id] && (
        <p style={{ fontSize: "12px" }} className="text-danger">
          {errorMessage[id]}
        </p>
      )}
    </div>
  );
};

export default Input;
