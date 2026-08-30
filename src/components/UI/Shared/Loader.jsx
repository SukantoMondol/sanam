import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center py-5"
      style={{ width: "100%" }}
    >
      <div className="position-relative d-flex align-items-center justify-content-center">
        <div
          className="spinner-border"
          role="status"
          style={{
            width: "70px",
            height: "70px",
            borderWidth: "3px",
            borderColor: "#00ADEF transparent #00ADEF transparent",
          }}
        />
        <div className="position-absolute d-flex align-items-center justify-content-center">
          <Image
            src="/assets/images/logo.png"
            alt="Sanam Store"
            width={44}
            height={44}
            style={{ borderRadius: "50%", objectFit: "contain" }}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
