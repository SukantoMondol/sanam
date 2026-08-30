import React from "react";
import Image from "next/image";

const Loading = () => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "60vh", width: "100%" }}
    >
      <div className="position-relative d-flex align-items-center justify-content-center">
        <div
          className="spinner-border"
          role="status"
          style={{
            width: "80px",
            height: "80px",
            borderWidth: "3px",
            borderColor: "#00ADEF transparent #00ADEF transparent",
          }}
        />
        <div className="position-absolute d-flex align-items-center justify-content-center">
          <Image
            src="/assets/images/logo.png"
            alt="Sanam Store"
            width={50}
            height={50}
            style={{ borderRadius: "50%", objectFit: "contain" }}
            priority
          />
        </div>
      </div>
      <p
        className="mt-3 text-muted small fw-medium"
        style={{ letterSpacing: "0.5px" }}
      >
        Loading...
      </p>
    </div>
  );
};

export default Loading;
