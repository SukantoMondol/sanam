import ForgotPassword from "@/components/Pages/Auth/ForgotPassword";

export const metadata = {
  title: `Forgot Password | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Forgot your password? Enter your email or phone to receive a verification link or OTP to reset your password.`,
};

const page = () => {
  return <ForgotPassword />;
};

export default page;
