import MyProfile from "@/components/Profile/myProfile/MyProfile";

export const metadata = {
  title: `My Profile | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Access and manage your account on ${process.env.NEXT_PUBLIC_SITE_NAME}. Update personal information, track orders, and manage your profile settings easily.`,
};

const ProfilePage = () => {
  return (
    <>
      <MyProfile />
    </>
  );
};

export default ProfilePage;
