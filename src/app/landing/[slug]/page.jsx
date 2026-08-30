import LandingPage from "@/components/Pages/LandingPage/LandingPage";

const page = async ({ params, searchParams }) => {
  return (
    <LandingPage params={await params} searchParams={await searchParams} />
  );
};

export default page;
