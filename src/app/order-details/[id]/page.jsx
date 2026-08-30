import OrderDetails from "@/components/Order/OrderDetails";

export const metadata = {
  title: `Order Details | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `View detailed information about your order with ${process.env.NEXT_PUBLIC_SITE_NAME}. Track your purchase, shipping status, and more.`,
};

const OrderDetailsPage = async ({ params }) => {
  const { id } = await params;
  return (
    <>
      <OrderDetails id={id} />
    </>
  );
};

export default OrderDetailsPage;
