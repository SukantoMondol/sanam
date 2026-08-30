const Form = ({ children, onSubmit, ...rest }) => {
  return (
    <form onSubmit={onSubmit} {...rest}>
      {children}
    </form>
  );
};

export default Form;
