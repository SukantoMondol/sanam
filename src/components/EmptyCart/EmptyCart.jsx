import Link from "next/link";

const EmptyCart = () => {
  return (
    <div className="emptyCartComponent container">
      <h1>
        Your cart is <span className="text-danger">empty!</span>
      </h1>
      <p className="text-muted text-center">
        Must add items on the cart before you proceed to checkout.
      </p>

      <Link href="/">Shop now</Link>
    </div>
  );
};

export default EmptyCart;
