import Link from "next/link";
import ImageComponent from "@/components/UI/Cards/ImageComponent";

export const metadata = {
  title: `404 Not Found - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: "Oops! The page you are looking for does not exist.",
};

const NotFound = () => {
  return (
    <div className={"container my-100"}>
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <ImageComponent
            src={"/assets/images/404-not-found.png"}
            alt={"404 Not Found"}
            width={386}
            height={185}
          />
          <Link className={"mt-5 d-block"} href={"/"}>
            <button
              className={
                "bg-white w-50 px-4 py-2 text-purple border-1 border-purple rounded-5 text-nowrap"
              }
            >
              Go Back Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
