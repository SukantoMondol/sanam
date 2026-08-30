"use client";

import dynamic from "next/dynamic";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import ImageComponent from "@/components/UI/Cards/ImageComponent";
import WhatsAppButton from "@/components/UI/WhatsAppButton";
// import {
//   FaArrowAltCircleUp,
//   FaFacebookF,
//   FaFacebookMessenger,
//   FaInstagram,
//   FaLinkedinIn,
//   FaPinterestP,
//   FaTiktok,
//   FaWhatsapp,
//   FaYoutube,
// } from "react-icons/fa";
// import { BiSolidPhoneCall } from "react-icons/bi";
// import { IoMdMailOpen } from "react-icons/io";
// import { FaClockRotateLeft, FaXTwitter } from "react-icons/fa6";

export const FaArrowAltCircleUp = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaArrowAltCircleUp),
  { ssr: false }
);

export const FaFacebookF = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaFacebookF),
  { ssr: false }
);

export const FaFacebookMessenger = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaFacebookMessenger),
  { ssr: false }
);

export const FaInstagram = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaInstagram),
  { ssr: false }
);

export const FaLinkedinIn = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaLinkedinIn),
  { ssr: false }
);

export const FaPinterestP = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaPinterestP),
  { ssr: false }
);

export const FaTiktok = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaTiktok),
  { ssr: false }
);

export const FaWhatsapp = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaWhatsapp),
  { ssr: false }
);

export const FaYoutube = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaYoutube),
  { ssr: false }
);

export const BiSolidPhoneCall = dynamic(
  () => import("react-icons/bi").then((mod) => mod.BiSolidPhoneCall),
  { ssr: false }
);

export const IoMdMailOpen = dynamic(
  () => import("react-icons/io").then((mod) => mod.IoMdMailOpen),
  { ssr: false }
);

export const FaClockRotateLeft = dynamic(
  () => import("react-icons/fa6").then((mod) => mod.FaClockRotateLeft),
  { ssr: false }
);

export const FaXTwitter = dynamic(
  () => import("react-icons/fa6").then((mod) => mod.FaXTwitter),
  { ssr: false }
);

import { toast } from "react-toastify";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";

export default function Footer() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [allOrder, setAllOrder] = useState([]);
  const handleClose = () => setShow(false);
  const [inputValue, setInputValue] = useState("");
  const [generalSettings, setGeneralSettings] = useState({});
  const [hotLine, setHotLine] = useState("");
  const [callUs, setCallUs] = useState("Call Us");
  const [token, setToken] = useState("");
  const [is_enable_whatsapp_chat, set_is_enable_whatsapp_chat] =
    useState(false);
  const [whats_app, set_whats_app] = useState([]);
  const [scroll, setScroll] = useState(false);
  const [newsLetterInput, setNewsLetterInput] = useState("");
  const [trackMyOrderError, setTrackMyOrderError] = useState("");

  // const handleTawkClick = () => {
  //   let id = getCookie("widget-visible");
  //   let element = document.querySelector(id);
  //   element.style.setProperty("display", "block", "important");

  //   if (window.Tawk_API && typeof window.Tawk_API.maximize === "function") {
  //     window.Tawk_API.maximize();
  //     console.log("Tawk.to chat window maximized.");
  //   } else {
  //     console.warn(
  //       "Tawk_API is not ready or the maximize function is unavailable."
  //     );
  //     // Optionally, you could try again after a short delay or notify the user
  //   }
  // };

  const handleMessengerClick = () => {
    const pageId = "sanamstore";
    const message = `হ্যালো! আমি পণ্য ক্রয় করতে কাস্টমার প্রতিনিধির সহযোগিতা চাই।`;
    const messengerLink = `https://m.me/${pageId}?text=${message}`;
    window.open(messengerLink, "_blank");
  };

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";

  const handleNewsLetterSubmit = () => {
    axios
      .post(API_BASE_URL + "/newsletter-post", {
        email: newsLetterInput,
      })
      .then((res) => {
        if (res.status == 200) {
          toast.success(res.data.status_message);
          setNewsLetterInput("");
        }
      })
      .catch((error) => {
        if (error.response.status == 422) {
          toast.error(error.response.data.message);
        }
      });
  };

  const handleInput = (e) => {
    setNewsLetterInput(e.target.value);
  };

  const handleCallUs = () => {
    if (callUs === "Call Us") {
      setCallUs(
        `<a href="tel:${
          hotLine || "+8801712730507"
        }" className="text-white fw-normal">${hotLine || "+8801712730507"}</a>`
      );
    }
  };

  const handleButtonClick = () => {
    if (inputValue.trim()) {
      router.push(`/order-details/${inputValue}`);
      setShow(false);
      setInputValue("");
      setTrackMyOrderError("");
    } else {
      setTrackMyOrderError(
        "Order ID is required. Please enter a valid Order ID to continue."
      );
    }
  };

  const handleOrderHistory = () => {
    if (token) {
      handleShow();
    } else {
      toast.error("Login required to view order history.");
      router.push("/sign-in");
    }
  };

  const orderData = async () => {
    const GetData = await axios.get(`${API_BASE_URL}/my-orders`, {
      headers: {
        Authorization: `Bearer ${token}`, // Replace YOUR_TOKEN_HERE with your actual token
      },
    });
    setAllOrder(GetData?.data?.data);
  };

  const handleWhatsapp = () => {
    setTimeout(() => {
      try {
        let scripts = localStorage.getItem("scripts");
        if (scripts) {
          const parsed = JSON.parse(scripts);
          if (Array.isArray(parsed)) {
            const waScript = parsed.find((script) => script.type == 6);
            if (waScript) {
              set_is_enable_whatsapp_chat(true);
              set_whats_app(waScript);
            }
          }
        }
      } catch (e) {}
    }, 1000);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("cookies-next")
        .then((cookieModule) => {
          const savedToken = cookieModule.getCookie("token");
          if (savedToken) {
            setToken(savedToken);
          }
        })
        .catch(() => {
          // ignore cookie import errors on unsupported environments
        });

      let baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        process.env.BASE_URL ||
        "http://127.0.0.1:8000/api/furniture";
      if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        baseUrl = baseUrl.replace(/127\.0\.0\.1|localhost/, hostname);
      }

      axios
        .get(`${baseUrl}/general-settings`)
        .then((res) => {
          if (res.data?.data) {
            setGeneralSettings(res.data.data);
            try {
              localStorage.setItem("generalSettings", JSON.stringify(res.data.data));
            } catch (e) {}
          }
        })
        .catch(() => {
          setGeneralSettings(
            JSON.parse(localStorage.getItem("generalSettings")) || {}
          );
        });

      let scripts = localStorage.getItem("scripts");
      if (!scripts) {
        for (let i = 0; i < 4; i++) {
          handleWhatsapp();
        }
      } else {
        try {
          const parsed = JSON.parse(scripts);
          if (Array.isArray(parsed)) {
            const waScript = parsed.find((script) => script.type == 6);
            if (waScript) {
              set_is_enable_whatsapp_chat(true);
              set_whats_app(waScript);
            }
          }
        } catch (e) {}
      }

      window.addEventListener("scroll", () => {
        setScroll(window.scrollY > 50);
      });
    }
  }, []);

  useEffect(() => {
    if (generalSettings?.hotline_number) {
      setHotLine(generalSettings?.hotline_number);
    }
  }, [generalSettings]);

  return (
    <footer className="bg-purple text-white pt-5 pb-2">
      <div className="container">
        <div className="row row-cols-lg-3 row-cols-xxl-5 row-cols-1 mb-5 text-center text-lg-start font-poppins">
          <div className="col">
            <Link href="/" passHref className="text-decoration-none">
              <ImageComponent
                src="/assets/images/logo.png"
                width={65}
                height={65}
                className="footer-logo"
                alt="Sanam Store Footer Logo"
                style={{ height: "60px", width: "auto", objectFit: "contain" }}
              />
            </Link>
            <address className="mt-4 mb-2 fw-normal footer-text mb-4">
              {generalSettings?.address || "Aswaq Qurrain 15 Street West of Abu Fatira Al-Herafia, Kuwait"}
            </address>
            <p>
              <Link
                href={`tel:${generalSettings?.hotline_number || "+96598714299"}`}
                className="mb-1 text-white fw-normal footer-text"
              >
                <BiSolidPhoneCall size={26} className="me-1" />
                {generalSettings?.hotline_number || "+965-98714299"}
              </Link>
            </p>
            <p className="my-1">
              <Link
                href={`tel:${generalSettings?.phone_2 || "+96599330508"}`}
                className="mb-1 text-white fw-normal footer-text"
              >
                <BiSolidPhoneCall size={26} className="me-1" />
                {generalSettings?.phone_2 || "+965-99330508"}
              </Link>
            </p>

            <p>
              <Link
                href={`mailto:${generalSettings?.email || "info@sanamstore.net"}`}
                className="text-white fw-normal footer-text"
              >
                <IoMdMailOpen size={26} className="me-1" />
                {generalSettings?.email || "info@sanamstore.net"}
              </Link>
            </p>
          </div>

          <div className="mb-4 mt-5 mt-lg-0 col">
            <p className="mb-4 fs-26 fw-semibold">About Us</p>
            <ul className="list-unstyled text-lg-start">
              <li className="mb-4">
                <Link
                  href="/company-profile"
                  className="text-white text-decoration-none  footer-text fw-normal"
                >
                  Company Profile
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/blog"
                  className="text-white text-decoration-none footer-text fw-normal"
                >
                  Blog
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/privacy-policy"
                  className="text-white text-decoration-none footer-text fw-normal"
                >
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/terms-and-conditions"
                  className="text-white text-decoration-none footer-text fw-normal"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery-and-return-policy"
                  className="text-white text-decoration-none footer-text fw-normal"
                >
                  Delivery And Return Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="mb-4 mt-4 mt-lg-0 col">
            <p className="mb-4 fw-semibold fs-26 ">Customer Service </p>
            <ul className="list-unstyled">
              <li className="mb-4">
                <Link
                  href="/my-profile"
                  className="cursor-pointer text-white text-decoration-none fw-normal footer-text mb-4"
                >
                  My Orders
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/cart"
                  className="cursor-pointer text-white text-decoration-none fw-normal footer-text mb-4"
                >
                  Shopping Cart
                </Link>
              </li>
              <li className="mb-4">
                <p
                  onClick={handleOrderHistory}
                  className="cursor-pointer text-white text-decoration-none fw-normal footer-text mb-4"
                >
                  Track My Order
                </p>
              </li>
              <li className="mb-4">
                <Link
                  href="/order-complain"
                  className="text-white text-decoration-none footer-text fw-normal"
                >
                  Order Complain
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/sale-on-sanam-store"
                  className="text-white text-decoration-none footer-text fw-normal"
                >
                  Sell on {process.env.NEXT_PUBLIC_SITE_NAME || "Sanam Store"}
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/product-request"
                  className="text-white text-decoration-none footer-text fw-normal"
                >
                  Product Request
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/meeting-request"
                  className="text-white text-decoration-none footer-text fw-normal"
                >
                  Book a Meeting
                </Link>
              </li>
            </ul>
          </div>

          <div className="mb-4 col">
            <p className="mb-4 fw-semibold fs-26">Contact Us </p>

            <div className="mb-4">
              <p className="footer-text">Every Day 9 AM To 2 AM </p>
            </div>

            <ul className="list-unstyled">
              <li>
                <button
                  onClick={handleCallUs}
                  className={"call-us-button mt-3"}
                >
                  <FaClockRotateLeft className="me-2" />
                  <span dangerouslySetInnerHTML={{ __html: callUs }} />
                </button>
              </li>

              <li>
                <Link
                  target={"_blank"}
                  href={`https://api.whatsapp.com/send/?phone=${(generalSettings?.whatsapp || generalSettings?.hotline_number || "+96598714299").replace(/[^0-9]/g, "")}&text=Hello%21+I+would+like+to+inquire+about+a+product+on+Sanam+Store.&type=phone_number&app_absent=0`}
                >
                  <button className={"call-us-button mt-3"}>
                    <FaWhatsapp className="me-2" />
                    <span>{generalSettings?.hotline_number || "+965-98714299"}</span>
                  </button>
                </Link>
              </li>

              <li>
                <button
                  onClick={handleMessengerClick}
                  className={"call-us-button mt-3"}
                >
                  <FaFacebookMessenger className="me-2" />
                  <span>{process.env.NEXT_PUBLIC_SITE_NAME || "Sanam Store"}</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="mb-4 mt-4 mt-lg-0 col">
            <p className="mb-4 fw-semibold fs-26">Follow Us</p>
            <div className="d-flex flex-row justify-content-center justify-content-lg-start gap-2 mb-4 footer-social">
              <Link
                className="d-flex justify-content-center align-items-center"
                aria-label="facebook"
                href={generalSettings?.facebook || "https://www.facebook.com/sanamstore.net"}
                target="_blank"
              >
                <FaFacebookF />
              </Link>

              <Link
                className="d-flex justify-content-center align-items-center"
                aria-label="twitter"
                href={generalSettings?.twitter || "https://x.com/sanamstore"}
                target="_blank"
              >
                <FaXTwitter />
              </Link>
              <Link
                className="d-flex justify-content-center align-items-center"
                href={generalSettings?.instagram || "https://www.instagram.com/sanamstore/"}
                aria-label="instagram"
                target="_blank"
              >
                <FaInstagram />
              </Link>

              {generalSettings?.linkedin && (
                <Link
                  className="d-flex justify-content-center align-items-center"
                  href={generalSettings.linkedin}
                  aria-label="linkedin"
                  target="_blank"
                >
                  <FaLinkedinIn />
                </Link>
              )}

              {generalSettings?.youtube && (
                <Link
                  className="d-flex justify-content-center align-items-center"
                  aria-label="youtube"
                  target="_blank"
                  href={generalSettings.youtube}
                >
                  <FaYoutube />
                </Link>
              )}
            </div>
            <p className="fw-normal footer-text mb-3">
              Subscribe and be the first to get great deals!
            </p>

            <form className="d-flex gap-2 mt-4 bottom-newsletter">
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                aria-label="Email subscription"
                onChange={handleInput}
                value={newsLetterInput}
              />
              <button
                type="button"
                onClick={handleNewsLetterSubmit}
                className="btn btn-light"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Sanam Logo + Copyright on Left, Kuwait Payment Badges on Right */}
      <div className="border-top border-white-50 mt-4 pt-3 pb-2">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          {/* Left: Logo & Copyright */}
          <div className="d-flex align-items-center gap-2">
            <img
              src="/assets/images/logo.png"
              alt="Sanam Store"
              style={{ height: "36px", width: "auto" }}
            />
            <span className="text-white small">
              Copyright &copy; {new Date().getFullYear()} {generalSettings?.default_page_title || "sanamstore.net"}. All rights reserved.
            </span>
          </div>

          {/* Right: Kuwait Payment Icons */}
          <div className="d-flex align-items-center gap-2 flex-wrap justify-content-center">
            <div className="bg-white px-2 py-1 rounded shadow-sm d-flex align-items-center" style={{ height: "30px" }}>
              <img src="/assets/images/payments/cod.png" alt="Cash On Delivery" style={{ height: "20px", width: "auto" }} />
            </div>
            <div className="bg-white px-2 py-1 rounded shadow-sm d-flex align-items-center" style={{ height: "30px" }}>
              <img src="/assets/images/payments/knet.png" alt="KNET" style={{ height: "22px", width: "auto" }} />
            </div>
            <div className="bg-white px-2 py-1 rounded shadow-sm d-flex align-items-center" style={{ height: "30px" }}>
              <img src="/assets/images/payments/mastercard.png" alt="VISA / MasterCard" style={{ height: "20px", width: "auto" }} />
            </div>
            <div className="bg-white px-2 py-1 rounded shadow-sm d-flex align-items-center" style={{ height: "30px" }}>
              <img src="/assets/images/payments/mf_apple.png" alt="Apple Pay" style={{ height: "20px", width: "auto" }} />
            </div>
            <div className="bg-white px-2 py-1 rounded shadow-sm d-flex align-items-center" style={{ height: "30px" }}>
              <img src="/assets/images/payments/tabby.png" alt="Tabby" style={{ height: "20px", width: "auto" }} />
            </div>
          </div>
        </div>
      </div>

      {scroll && (
        <div
          className="d-none d-lg-block"
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            fontSize: "2rem",
            color: "#fff",
            backgroundColor: "var(--primary-color)",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            zIndex: "999",
            transition: "opacity 0.2s ease-in-out",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <FaArrowAltCircleUp style={{ marginLeft: "10px" }} />
        </div>
      )}

      {is_enable_whatsapp_chat ? (
        <WhatsAppButton whats_app={whats_app} />
      ) : null}
    </footer>
  );
}
