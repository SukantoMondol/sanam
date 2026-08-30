import SignIn from "@/components/Pages/Auth/SignIn";

export const metadata = {
  title: `Sign In | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Sign in to your ${process.env.NEXT_PUBLIC_SITE_NAME} account to access exclusive furniture deals and manage your profile.`,
};

const page = () => {
  return <SignIn />;
};

export default page;
