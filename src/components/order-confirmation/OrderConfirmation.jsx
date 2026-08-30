"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  PhoneCall,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  PackageCheck,
} from "lucide-react";
import { trackPaymentInitiated } from "@/utils/ga4Ecommerce";

export default function OrderConfirmation({ params }) {
  const router = useRouter();

  const payNow = () => {
    trackPaymentInitiated({
      invoiceNo: params,
    });
    router.push(`/pay/${params}`);
  };

  return (
    <div className="container marginTop-conditional mb-5 py-3">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-7">
          {/* Main Success Card */}
          <div
            className="bg-white rounded-4 shadow-lg overflow-hidden border-0 position-relative"
            style={{
              boxShadow: "0 10px 40px rgba(107, 33, 168, 0.08)",
            }}
          >
            {/* Top Accent Gradient Bar */}
            <div
              style={{
                height: "6px",
                background: "linear-gradient(90deg, #6B21A8 0%, #A855F7 50%, #EC4899 100%)",
              }}
            />

            <div className="p-4 p-md-5 text-center">
              {/* Animated Success Icon Badge */}
              <div className="d-flex justify-content-center mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center position-relative"
                  style={{
                    width: "84px",
                    height: "84px",
                    backgroundColor: "rgba(107, 33, 168, 0.08)",
                    border: "2px solid rgba(107, 33, 168, 0.15)",
                  }}
                >
                  <CheckCircle2 size={48} className="text-purple" style={{ color: "#6B21A8" }} />
                </div>
              </div>

              {/* Congratulations Title */}
              <h1
                className="fw-bold mb-2 text-purple"
                style={{
                  color: "#6B21A8",
                  fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                  letterSpacing: "-0.5px",
                }}
              >
                অভিনন্দন !!
              </h1>

              {/* Order ID Pill */}
              {params && (
                <div className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill bg-light text-muted small fw-medium mb-3 border">
                  <PackageCheck size={15} className="text-purple" style={{ color: "#6B21A8" }} />
                  <span>অর্ডার আইডি: #{params}</span>
                </div>
              )}

              <p
                className="text-dark fw-semibold mb-4"
                style={{ fontSize: "1.15rem", lineHeight: "1.6" }}
              >
                আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে।
              </p>

              {/* Information Card */}
              <div
                className="rounded-3 p-3 p-md-4 mb-4 text-start"
                style={{
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #F3F4F6",
                }}
              >
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div
                    className="p-2 rounded-circle bg-white shadow-sm mt-1 flex-shrink-0"
                    style={{ color: "#6B21A8" }}
                  >
                    <PhoneCall size={18} />
                  </div>
                  <div>
                    <h6 className="mb-1 fw-bold text-dark" style={{ fontSize: "0.95rem" }}>
                      যোগাযোগ তথ্য
                    </h6>
                    <p className="text-muted mb-0 small" style={{ lineHeight: "1.5" }}>
                      ডেলিভারি করার পূর্বে আমাদের প্রতিনিধি আপনার সাথে ফোন নম্বরে যোগাযোগ করবেন।
                    </p>
                  </div>
                </div>

                <hr className="my-3 text-muted opacity-25" />

                <div className="d-flex align-items-start gap-3">
                  <div
                    className="p-2 rounded-circle bg-white shadow-sm mt-1 flex-shrink-0"
                    style={{ color: "#6B21A8" }}
                  >
                    <Clock size={18} />
                  </div>
                  <div>
                    <h6 className="mb-1 fw-bold text-dark" style={{ fontSize: "0.95rem" }}>
                      যোগাযোগের সময়সূচী
                    </h6>
                    <p className="text-muted mb-0 small">
                      প্রতিদিন <strong className="text-dark">সকাল ৯:০০ টা</strong> থেকে{" "}
                      <strong className="text-dark">রাত ৯:০০ টা</strong> পর্যন্ত।
                    </p>
                  </div>
                </div>
              </div>

              {/* Fast Delivery & Payment Offer Card */}
              <div
                className="rounded-3 p-3 p-md-4 mb-4 text-start position-relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(107, 33, 168, 0.05) 0%, rgba(168, 85, 247, 0.08) 100%)",
                  border: "1px solid rgba(107, 33, 168, 0.15)",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="p-2.5 rounded-circle text-white flex-shrink-0"
                    style={{ backgroundColor: "#6B21A8" }}
                  >
                    <CreditCard size={22} />
                  </div>
                  <div>
                    <span
                      className="badge bg-purple text-white px-2.5 py-1 mb-1 fw-medium"
                      style={{ backgroundColor: "#6B21A8", fontSize: "0.75rem" }}
                    >
                      দ্রুত ডেলিভারির জন্য
                    </span>
                    <p
                      className="fw-bold mb-0 text-dark"
                      style={{ fontSize: "0.95rem", color: "#374151" }}
                    >
                      ডেলিভারি চার্জ অথবা মূল্য অগ্রিম পরিশোধ করুন।
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 mt-4">
                <Link href="/" className="w-100 w-sm-auto text-decoration-none">
                  <button
                    className="btn w-100 btn-outline-purple px-4 py-2.5 rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2"
                    style={{
                      borderColor: "#6B21A8",
                      color: "#6B21A8",
                      minHeight: "48px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <ShoppingBag size={18} />
                    <span>Continue shopping</span>
                  </button>
                </Link>

                <button
                  className="btn w-100 w-sm-auto px-4 py-2.5 rounded-pill text-white fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  style={{
                    backgroundColor: "#6B21A8",
                    borderColor: "#6B21A8",
                    minHeight: "48px",
                    boxShadow: "0 4px 14px rgba(107, 33, 168, 0.35)",
                    transition: "all 0.2s ease",
                  }}
                  onClick={payNow}
                >
                  <span>Proceed to payment</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

