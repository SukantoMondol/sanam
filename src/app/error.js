"use client";

import ImageComponent from "@/components/UI/Cards/ImageComponent";
import Link from "next/link";
import React from "react";

const ErrorPage = ({ error, reset }) => {
    if (error?.message === '404-Page Not Found') {
        return (
            <div className="container">
                <div className={"container my-100"}>
                    <div className="row justify-content-center">
                        <div className="col-md-6 text-center">
                            <ImageComponent
                                src={"/assets/images/404-not-found.png"}
                                alt={"404 Not Found"}
                                width={386}
                                height={185}
                            />
                            <h3 className={"text-danger mt-5"}>Your desired product is not found</h3>
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
            </div>
        );
    }
  return (
    <div className="container">
      <p className="text-danger">{error?.message}</p>
      <button onClick={() => reset()}>Refresh the page</button>
    </div>
  );
};

export default ErrorPage;
