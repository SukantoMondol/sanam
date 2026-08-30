import EditProfile from "@/components/Profile/myProfile/EditProfile";

export const metadata = {
  title: `Edit Profile | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Update and manage your profile information including name, email, phone, and other details on ${process.env.NEXT_PUBLIC_SITE_NAME}.`,
};

const EditPage = () => {
  return (
    <>
      <EditProfile />
    </>
  );
};

export default EditPage;
