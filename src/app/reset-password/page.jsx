import ResetPassword from "@/components/Pages/Auth/ResetPassword";

export const metadata = {
  title: `Reset Password | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Reset your password for ${process.env.NEXT_PUBLIC_SITE_NAME} to regain access to your account and continue enjoying premium furniture shopping.`,
};

const page = async ({ searchParams }) => {
  return <ResetPassword searchParams={await searchParams} />;
};

export default page;
