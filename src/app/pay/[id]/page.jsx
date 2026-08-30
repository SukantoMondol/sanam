import { Suspense } from "react";
import Payment from "@/components/Payment/Payment";
import Loader from "@/components/UI/Shared/Loader";

export const metadata = {
  title: `Payment | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Securely complete your payment at ${process.env.NEXT_PUBLIC_SITE_NAME}. We offer safe and easy checkout for your furniture and home décor purchases.`,
};

const Pay = async ({ params }) => {
  const { id } = await params;
  return (
    <Suspense fallback={<Loader />}>
      <Payment params={id} />
    </Suspense>
  );
};

export default Pay;
