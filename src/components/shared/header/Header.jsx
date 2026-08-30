"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import useCart from "@/hooks/useCart";
import axios from "axios";
import axiosInstance from "@/utils/axiosInstance";
import ImageComponent from "@/components/UI/Cards/ImageComponent";
import { deleteCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import logo from "../../../../public/assets/images/logo.png";
import SearchBar from "./SearchBar";
import SanamMegaMenu from "./SanamMegaMenu";
import catalogData from "@/data/allCategoriesCatalog.json";

const DEFAULT_CATEGORIES = catalogData?.data || [];

const FaBars = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaBars),
  { ssr: false }
);
const FiShoppingCart = dynamic(
  () => import("react-icons/fi").then((mod) => mod.FiShoppingCart),
  { ssr: false }
);
const FiUser = dynamic(
  () => import("react-icons/fi").then((mod) => mod.FiUser),
  { ssr: false }
);
const FiTruck = dynamic(
  () => import("react-icons/fi").then((mod) => mod.FiTruck),
  { ssr: false }
);
const FiShield = dynamic(
  () => import("react-icons/fi").then((mod) => mod.FiShield),
  { ssr: false }
);
const FiSmartphone = dynamic(
  () => import("react-icons/fi").then((mod) => mod.FiSmartphone),
  { ssr: false }
);
const FiHeadphones = dynamic(
  () => import("react-icons/fi").then((mod) => mod.FiHeadphones),
  { ssr: false }
);
const FiBox = dynamic(
  () => import("react-icons/fi").then((mod) => mod.FiBox),
  { ssr: false }
);
const FiChevronRight = dynamic(
  () => import("react-icons/fi").then((mod) => mod.FiChevronRight),
  { ssr: false }
);
const FiGlobe = dynamic(
  () => import("react-icons/fi").then((mod) => mod.FiGlobe),
  { ssr: false }
);
const FiThumbsUp = dynamic(
  () => import("react-icons/fi").then((mod) => mod.FiThumbsUp),
  { ssr: false }
);
const FiStar = dynamic(
  () => import("react-icons/fi").then((mod) => mod.FiStar),
  { ssr: false }
);
// Pure CSS continuous vertical sliding ticker (100% smooth & reliable)
function TopBarRotator() {
  const items = [
    {
      title: "Free returns",
      sub: "Up to 90 days*",
      icon: (
        <div className="temu-yellow-badge-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#111111">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
        </div>
      ),
    },
    {
      title: "Price adjustment",
      sub: "Within 30 days",
      icon: (
        <div className="temu-yellow-badge-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#111111">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14h-2v-1.5c-1.38-.28-2.5-1.28-2.5-2.5h2c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5c0-1.1-.9-1.5-2-1.9-1.38-.5-3-.9-3-2.6 0-1.22.9-2.22 2-2.5V4h2v1.5c1.38.28 2.5 1.28 2.5 2.5h-2c0-.83-.67-1.5-1.5-1.5S10 7.17 10 8c0 1.1.9 1.5 2 1.9 1.38.5 3 .9 3 2.6 0 1.22-.9 2.22-2 2.5V16z"/>
          </svg>
        </div>
      ),
    },
    {
      title: "Delivery guarantee",
      sub: "Refund for any issues",
      icon: (
        <div className="temu-yellow-badge-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#111111">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM9.5 13.5l-2.5-2.5 1.41-1.41 1.09 1.08 3.59-3.58 1.41 1.41-5 5z"/>
          </svg>
        </div>
      ),
    },
    // Seamless loop back to item 1
    {
      title: "Free returns",
      sub: "Up to 90 days*",
      icon: (
        <div className="temu-yellow-badge-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#111111">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
        </div>
      ),
    },
  ];

  return (
    <div className="temu-rotating-viewport">
      <div className="temu-rotating-track-pure-css">
        {items.map((item, idx) => (
          <div className="temu-rotating-item-row" key={idx}>
            {item.icon}
            <div className="temu-top-text-stacked ms-2">
              <div className="temu-top-title-yellow">{item.title}</div>
              <div className="temu-top-sub">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { fetchCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [token, setToken] = useState(null);
  const [hideTopBar, setHideTopBar] = useState(false);
  const pathname = usePathname();
  const totalQuantity = useSelector((state) => state.totalProductQuantity);
  const categoriesFetched = useRef(false);
  const profileFetched = useRef(false);
  const menuTimeoutRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
    fetchCart();
  }, []);

  // Hide top bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setHideTopBar(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getCategories = useCallback(() => {
    axios
      .get(`/api/category_list-hierarchy`)
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Categories fetch error:", err);
      });
  }, []);

  const fetchProfiledata = useCallback(async () => {
    if (!token || profileFetched.current) return;
    profileFetched.current = true;
    try {
      const response = await axiosInstance.get("/profile-view");
      if (response?.data?.status) {
        setProfileData(response?.data?.data);
      } else {
        toast.error(response?.data?.status_message);
      }
    } catch (error) {
      profileFetched.current = false;
    }
  }, [token]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    if (token) {
      fetchProfiledata();
    }
  }, [token, fetchProfiledata]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await axiosInstance.post("/logout");
    } catch (error) {
      // silent fail
    } finally {
      if (typeof window !== "undefined") {
        import("cookies-next").then((cookieModule) => {
          cookieModule.deleteCookie("token");
          cookieModule.deleteCookie("user_id");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          window.location.href = "/sign-in";
        }).catch(() => {
          window.location.href = "/sign-in";
        });
      }
    }
  }, []);

  const handleMouseEnterCategories = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setIsCategoriesOpen(true);
  };

  const handleMouseLeaveCategories = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setIsCategoriesOpen(false);
    }, 350);
  };

  // Get flat categories list with reliable fallback
  const allCategories = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      return categories;
    }
    return DEFAULT_CATEGORIES;
  }, [categories]);

  return (
    <header className="temu-header-wrapper">
      {/* ====== PART 1: Top Announcement Bar (Desktop Only - Hidden on Mobile) ====== */}
      <div className={`temu-top-bar ${hideTopBar ? "temu-top-bar--hidden" : ""} d-none d-lg-block`}>
        <div className="container-fluid px-xl-5 px-lg-4 px-3 d-flex align-items-center justify-content-between h-100">
          {/* Column 1 (25%): Free shipping (Centered) */}
          <div className="temu-top-col temu-top-col--1 d-flex align-items-center justify-content-center">
            <div className="temu-top-item d-flex align-items-center justify-content-center w-100">
              <svg className="temu-top-icon" viewBox="0 0 24 24" width="30" height="30" fill="#00e676">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
              <div className="temu-top-text-stacked ms-2">
                <div className="temu-top-title-green">Free shipping &gt;</div>
                <div className="temu-top-sub">Min. order: 5 KWD</div>
              </div>
            </div>
            <div className="temu-top-divider d-none d-md-block"></div>
          </div>

          {/* Column 2 (25%): Auto-Rotating Slider (Middle) */}
          <div className="temu-top-col temu-top-col--2 d-none d-md-flex align-items-center justify-content-center">
            <div className="temu-top-item d-flex align-items-center justify-content-center w-100">
              <TopBarRotator />
            </div>
            <div className="temu-top-divider d-none d-lg-block"></div>
          </div>

          {/* Column 3 (25%): Get the Sanam App */}
          <div className="temu-top-col temu-top-col--3 d-none d-lg-flex align-items-center justify-content-center">
            <Link
              href="/app-download"
              className="temu-top-item d-flex align-items-center justify-content-center w-100 text-decoration-none"
            >
              <svg className="temu-top-icon" viewBox="0 0 24 24" width="28" height="28" fill="#ffd54f">
                <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
              </svg>
              <div className="temu-top-title-yellow ms-2">Get the Sanam App</div>
            </Link>
            <div className="temu-top-divider d-none d-xl-block"></div>
          </div>

          {/* Column 4 (25%): Right Promo Banner Card (Exact Picture 2 Match) */}
          <div className="temu-top-col temu-top-col--4 d-none d-sm-flex align-items-center justify-content-end">
            <Link href="/all-products" className="temu-top-seller-banner d-flex align-items-center justify-content-between text-decoration-none">
              <div className="temu-top-seller-text d-flex flex-column text-start">
                <span className="temu-top-seller-line1">Start Selling to Millions of</span>
                <span className="temu-top-seller-line2">Buyers on Sanam</span>
              </div>
              <span className="temu-top-seller-btn">
                Join Now &gt;
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ====== PART 2: Main Navigation Bar ====== */}
      {/* Desktop Main Navigation (Orange Bar) */}
      <div className="temu-main-nav d-none d-lg-block">
        <div className="container-fluid px-xl-5 px-lg-4 px-3 d-flex align-items-center justify-content-between gap-2 gap-lg-3">
          {/* Logo */}
          <div className="d-flex align-items-center gap-2">
            <Link href="/" className="temu-logo d-flex align-items-center">
              <div className="temu-logo-badge">
                <ImageComponent
                  src={logo}
                  width={75}
                  height={75}
                  alt="Sanam Store"
                  priority
                  fetchPriority="high"
                  loading="eager"
                  style={{ height: "46px", width: "auto", objectFit: "contain" }}
                />
              </div>
            </Link>
          </div>

          {/* Nav Links - Desktop */}
          <nav className="temu-nav-links d-none d-xl-flex align-items-center">
            <Link href="/all-products?sort=best-selling" className="temu-nav-item">
              <FiThumbsUp className="temu-nav-item-icon" />
              <span>Best-Selling Items</span>
            </Link>
            <Link href="/all-products?sort=top-rated" className="temu-nav-item">
              <FiStar className="temu-nav-item-icon" />
              <span>5-Star Rated</span>
            </Link>
            <Link href="/all-products" className="temu-nav-item">
              <span>New In</span>
            </Link>

            {/* Categories Dropdown Trigger */}
            <div
              className={`temu-categories-btn-container ${isCategoriesOpen ? "temu-categories-btn-container--active" : ""}`}
              onMouseEnter={handleMouseEnterCategories}
              onMouseLeave={handleMouseLeaveCategories}
            >
              <button
                type="button"
                className="temu-categories-btn"
                onClick={() => setIsCategoriesOpen((prev) => !prev)}
              >
                <span>Categories</span>
                <span className="ms-1">{isCategoriesOpen ? "▲" : "▼"}</span>
              </button>

              {/* Mega Menu Popup Component */}
              <SanamMegaMenu
                categories={allCategories}
                onClose={() => setIsCategoriesOpen(false)}
              />
            </div>
          </nav>

          {/* Large Search Bar */}
          <div className="temu-search-wrapper flex-grow-1 mx-2">
            <SearchBar className="temu-search-bar-custom w-100" />
          </div>

          {/* Right Action Icons */}
          <div className="temu-actions-group d-flex align-items-center gap-3 gap-xxl-4">
            {token ? (
              <DropdownButton
                id="temu-profile-dropdown"
                title={
                  <div className="temu-header-action-btn">
                    <FiUser className="temu-header-action-icon" />
                    <div className="temu-header-action-labels d-none d-md-flex flex-column text-start">
                      <span className="temu-header-action-sub">Hello,</span>
                      <span className="temu-header-action-main">{profileData?.name?.split(" ")[0] || "Account"}</span>
                    </div>
                  </div>
                }
                className="temu-custom-dropdown-btn"
              >
                <Dropdown.Item as="button">
                  <Link className="text-black w-100 d-inline-block text-decoration-none" href="/my-profile">
                    Profile
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item as="button" onClick={() => handleSignOut()}>
                  <span>Sign Out</span>
                </Dropdown.Item>
              </DropdownButton>
            ) : (
              <Link href="/sign-in" className="temu-header-action-btn text-decoration-none">
                <FiUser className="temu-header-action-icon" />
                <div className="temu-header-action-labels d-none d-md-flex flex-column text-start">
                  <span className="temu-header-action-sub">Sign in / Register</span>
                  <span className="temu-header-action-main">Orders & Account</span>
                </div>
              </Link>
            )}

            <Link href="/contact-us" className="temu-header-action-btn text-decoration-none d-none d-lg-flex">
              <FiHeadphones className="temu-header-action-icon" />
              <div className="temu-header-action-labels d-flex flex-column text-start">
                <span className="temu-header-action-main">Support</span>
              </div>
            </Link>

            <div className="temu-header-action-btn d-none d-xl-flex">
              <FiGlobe className="temu-header-action-icon" />
              <span className="temu-header-action-main">Kuwait</span>
            </div>

            <Link href="/cart" className="temu-header-action-btn temu-cart-action text-decoration-none">
              <div className="temu-cart-badge-container">
                <FiShoppingCart className="temu-header-action-icon temu-cart-icon" />
                <span className="temu-header-cart-count">{totalQuantity || 0}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ====== Mobile Header Layout (Exact Reference Match) ====== */}
      <div className="temu-mobile-header-block d-lg-none bg-white border-bottom">
        {/* Row 1: Logo + Search Pill + Menu/User/Cart Icons */}
        <div className="d-flex align-items-center justify-content-between px-2 py-2 gap-2 flex-nowrap w-100">
          {/* Logo */}
          <Link href="/" className="text-decoration-none flex-shrink-0">
            <span className="temu-mobile-logo-text">SANAM</span>
          </Link>

          {/* Search Pill */}
          <div className="temu-mobile-search-pill flex-grow-1" style={{ minWidth: 0 }}>
            <SearchBar className="temu-search-bar-mobile w-100" />
          </div>

          {/* Mobile Actions: Menu, User, Cart */}
          <div className="d-flex align-items-center gap-2 gap-sm-3 flex-shrink-0">
            {/* Categories List Icon */}
            <button
              className="temu-mobile-icon-btn border-0 bg-transparent p-1"
              onClick={toggleMobileMenu}
              aria-label="Categories Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>

            {/* Profile / Sign In Icon */}
            <Link
              href={token ? "/my-profile" : "/sign-in"}
              className="temu-mobile-icon-btn text-dark text-decoration-none p-1"
              aria-label="Sign in / Profile"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>

            {/* Shopping Cart Icon */}
            <Link
              href="/cart"
              className="temu-mobile-icon-btn text-dark text-decoration-none position-relative p-1"
              aria-label="Cart"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {totalQuantity > 0 && (
                <span className="temu-mobile-cart-badge">{totalQuantity}</span>
              )}
            </Link>
          </div>
        </div>

        {/* Row 2: Horizontal Category Tabs */}
        <div className="temu-mobile-cat-scroll d-flex align-items-center px-2 border-top">
          <Link
            href="/all-products"
            className="temu-mobile-cat-tab temu-mobile-cat-tab--active flex-shrink-0 text-decoration-none"
          >
            All
          </Link>
          {allCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="temu-mobile-cat-tab flex-shrink-0 text-decoration-none"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ====== PART 3: Trust Bar (Temu Green Rounded Bar) ====== */}
      <div className="temu-trust-bar-wrapper py-1 bg-white">
        <div className="container">
          {/* Desktop & Tablet Trust Bar */}
          <div className="temu-trust-bar d-none d-md-flex align-items-center justify-content-between px-3 py-2 rounded-2 flex-nowrap overflow-hidden">
            <div className="temu-trust-item temu-trust-item--highlight d-flex align-items-center gap-2 flex-shrink-0">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="temu-trust-shield-icon flex-shrink-0"
              >
                <path
                  d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z"
                  fill="white"
                />
                <path
                  d="M9.5 11.5L11 13L15 9"
                  stroke="#008216"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="fw-bold">Why choose {process.env.NEXT_PUBLIC_SITE_NAME || "Sanam Store"}?</span>
            </div>

            <div className="d-flex align-items-center gap-2 gap-lg-3 flex-nowrap">
              <span className="temu-trust-item d-none d-lg-flex align-items-center gap-1">
                <span>🔒</span>
                <span>Secure privacy</span>
              </span>
              <span className="temu-trust-divider opacity-50 d-none d-lg-inline">|</span>
              <span className="temu-trust-item d-flex align-items-center gap-1">
                <span>💳</span>
                <span>Safe payments</span>
              </span>
              <span className="temu-trust-divider opacity-50">|</span>
              <span className="temu-trust-item d-flex align-items-center gap-1">
                <span>🚚</span>
                <span>Delivery guarantee &gt;</span>
              </span>
            </div>
          </div>

          {/* Mobile Trust Bar (Exact Match to Picture 2) */}
          <div className="temu-trust-bar d-flex d-md-none align-items-center justify-content-between px-2 py-1 rounded-2">
            <div className="temu-trust-item temu-trust-item--highlight d-flex align-items-center gap-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z"
                  fill="white"
                />
                <path
                  d="M9.5 11.5L11 13L15 9"
                  stroke="#008216"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span style={{ fontSize: "12px", fontWeight: "700" }}>
                Why choose {process.env.NEXT_PUBLIC_SITE_NAME || "Sanam"}?
              </span>
            </div>

            <div className="temu-trust-item d-flex align-items-center gap-1">
              <span style={{ fontSize: "12px", fontWeight: "600" }}>Safe payments &gt;</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====== Mobile Drawer ====== */}
      {isMobileMenuOpen && (
        <>
          <div className="temu-overlay" onClick={closeMobileMenu} />
          <div className="temu-mobile-drawer">
            <div className="temu-mobile-drawer__header">
              <ImageComponent
                src={logo}
                width={45}
                height={45}
                alt="Sanam Store"
                style={{ height: "40px", width: "auto", objectFit: "contain" }}
              />
              <button onClick={closeMobileMenu} className="temu-mobile-drawer__close">
                ✕
              </button>
            </div>

            <div className="temu-mobile-drawer__links">
              <Link href="/all-products?sort=best-selling" className="temu-mobile-link" onClick={closeMobileMenu}>
                👍 Best-Selling Items
              </Link>
              <Link href="/all-products?sort=top-rated" className="temu-mobile-link" onClick={closeMobileMenu}>
                ⭐ 5-Star Rated
              </Link>
              <Link href="/all-products" className="temu-mobile-link" onClick={closeMobileMenu}>
                🆕 New In
              </Link>
            </div>

            <div className="temu-mobile-drawer__divider" />

            <div className="temu-mobile-drawer__categories">
              <p className="temu-mobile-drawer__section-title">All Categories</p>
              {allCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category?.slug}`}
                  className="temu-mobile-cat-link"
                  onClick={closeMobileMenu}
                >
                  {category?.picture && (
                    <ImageComponent
                      src={category.picture}
                      width={32}
                      height={32}
                      alt={category.name}
                      className="temu-mobile-cat-img"
                    />
                  )}
                  <span>{category?.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
}