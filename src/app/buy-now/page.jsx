import Checkout from "@/components/checkout/Checkout";

export const metadata = {
  title: `Order Now | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Order premium-quality furniture and décor from ${process.env.NEXT_PUBLIC_SITE_NAME} today. Fast, secure, and hassle-free checkout.`,
};

const page = () => {
  return <Checkout mode="buyNow" />;
};

export default page;
