import SignUp from "@/components/Pages/Auth/SignUp";

export const metadata = {
  title: `Sign Up | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Create your ${process.env.NEXT_PUBLIC_SITE_NAME} account to explore premium furniture collections and enjoy exclusive deals in Kuwait.`,
};

const page = () => {
  return <SignUp />;
};

export default page;
