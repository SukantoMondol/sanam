const Button = ({ children, className, disabled = false, ...rest }) => {
  return (
    <button disabled={disabled} className={`button ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
