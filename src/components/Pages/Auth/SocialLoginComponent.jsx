import Link from "next/link";
import Image from "next/image";

const SocialLoginComponent = ({ href }) => {
  const paymentBaseUrl = process.env.NEXT_PUBLIC_PAYMENT_URL?.replace(/\/$/, "");

  return (
    <div className="socialLoginContainer">
      <p>Or, login with</p>
      <div>
        <Link href={`${paymentBaseUrl}/auth/google`}>
          <Image
            src={"/assets/images/icons/google-icon.webp"}
            alt="Google"
            width={18}
            height={18}
            className="me-2"
          />
          Proceed with Google
        </Link>
      </div>
      {href === "/sign-up" ? (
        <p>
          If you don't have an account, <Link href={href}>register here.</Link>
        </p>
      ) : (
        <p>
          If you have an account <Link href={href}>Login here</Link>
        </p>
      )}
    </div>
  );
};

export default SocialLoginComponent;
