import OrderConfirmation from "@/components/order-confirmation/OrderConfirmation";

export const metadata = {
  title: `Order Confirmation | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Thank you for your purchase! View your order confirmation details with ${process.env.NEXT_PUBLIC_SITE_NAME} and track your order status.`,
};

const page = async ({ params }) => {
  const { id } = await params;
  return (
    <div>
      <OrderConfirmation params={id} />
    </div>
  );
};

export default page;
