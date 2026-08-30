import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = (props) => {
  //console.log(props, 'naim')
  const phoneNumber = props?.whats_app?.app_key; // Replace with your WhatsApp number
  const message = props?.whats_app?.script;

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <button
      aria-label="WhatsApp"
      onClick={handleClick}
      style={{
        backgroundColor: "#25D366",
        color: "#fff",
        padding: "12px",
        borderRadius: "50%",
        cursor: "pointer",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        position: "fixed",
        border: "2px solid white",
        animation: "bounce 2s infinite",
        zIndex: 1,
      }}
      className="whatsapp-floating-btn"
    >
      <FaWhatsapp
        style={{
          fontSize: "25px",
        }}
      />
    </button>
  );
};

export default WhatsAppButton;
