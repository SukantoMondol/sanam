// "use client";

// import { useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";

// export default function SaleForm() {
//   const [formData, setFormData] = useState({
//     customerName: "",
//     phone: "",
//     email: "",
//     productName: "",
//     productDetails: "",
//     salePrice: "",
//     stockQuantity: "",
//     productImage: null,
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(formData);
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setFormData({ ...formData, productImage: e.target.files[0] });
//     }
//   };

//   return (
//     <div className="container py-4 my-2 bg-white shadow rounded">
//       <div className="row g-0">
//         <div className="col-lg-6 col-md-6 d-none d-md-flex d-flex align-items-center justify-content-center p-4">
//           <img src="/assets/images/banner/banner3.png" alt="Deshify Promotion" className="img-fluid h-100 w-100 object-fit-cover" />
//         </div>
//         <div className="col-lg-6 col-md-12  p-4">
//           <h2 className="text-dark fw-semibold mb-3 fw-bold text-muted text-center">Contact Us</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-3 d-flex ">
//               <label className="form-label w-25 fw-bold text-muted">Name :</label>
//               <input
//                 type="text"
//                 className="form-control border-purple w-75"
//                 placeholder="Write your Name*"
//                 value={formData.customerName}
//                 onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
//               />
//             </div>

//             <div className="mb-3 d-flex">
//               <label className="form-label w-25 fw-bold text-muted">Phone :</label>
//               <input
//                 type="tel"
//                 className="form-control border-purple w-75"
//                 placeholder="Your Phone*"
//                 value={formData.phone}
//                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//               />
//             </div>

//             <div className="mb-3 d-flex">
//               <label className="form-label w-25 fw-bold text-muted">Email :</label>
//               <input
//                 type="email"
//                 className="form-control border-purple w-75"
//                 placeholder="Your Email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               />
//             </div>

//             <div className="mb-3 d-flex">
//               <label className="form-label w-25 fw-bold text-muted">Subject :</label>
//               <input
//                 type="text"
//                 className="form-control border-purple w-75"
//                 placeholder="Your Subject*"
//                 value={formData.productName}
//                 onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
//               />
//             </div>

//             <div className="mb-3 d-flex">
//               <label className="form-label w-25 fw-bold text-muted">Message :</label>
//               <textarea
//                 className="form-control border-purple w-75"
//                 placeholder="Write your message*"
//                 value={formData.productDetails}
//                 onChange={(e) => setFormData({ ...formData, productDetails: e.target.value })}
//                 rows={3}
//               />
//             </div>
//             <div className="mb-3 d-flex ">
//               <div className="w-25"></div>
//               <div className="w-75">
//                 <ReCAPTCHA sitekey="your-recaptcha-site-key" onChange={() => {}} />
//               </div>
//             </div>
//             <div className="mb-3 d-flex ">
//               <div className="w-25"></div>
//               <div className="w-75">
//                 <button type="submit" className="rounded py-2 px-4 mt-3  btn btn-outline-purple w-50  ">
//                   Send Message
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// ************************************************

// "use client";

// import { useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
// import axios from "axios";
// import { useState } from "react";
// import axios from "axios";
// import { Bounce, toast } from "react-toastify";

// export default function SaleForm() {
//   const [token, setToken] = useState("");
//   const [error, setError] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     customer_name: "",
//     customer_number: "",
//     customer_email: "",
//     subject: "",
//     order_id: "",
//     Message: "",
//     // stock_quantity: "",
//     // product_image: null,
//   });

// ***********************
// export default function SaleForm() {
//   const [token, setToken] = useState("");

//   const [error, setError] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     customer_name: "",
//     customer_number: "",
//     customer_email: "",
//     product_name: "",
//     product_details: "",
//     sale_price: "",
//     stock_quantity: "",
//     product_image: null,
//   });

// ***********************

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setIsLoading(true);
//   axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/contact-us`, formData)
//   .then(res) => {
//     setFormData({
//       customer_name: "",
//       customer_number: "",
//       customer_email: "",
//       product_name: "",
//       product_details: "",
//       sale_price: "",
//       stock_quantity: "",
//       product_image: null,});
//   }
//   toast(res.data.status_message, {
//     //         position: "top-right",
//     //         autoClose: 5000,
//     //         hideProgressBar: false,
//     //         closeOnClick: false,
//     //         pauseOnHover: true,
//     //         draggable: true,
//     //         progress: undefined,
//     //         theme: "light",
//     //         transition: Bounce,
//     //       });
//   const formDataToSend = new FormData();
//   Object.keys(formData).forEach((key) => {
//     formDataToSend.append(key, formData[key]);
//   });

//   try {
//     const response = await axios.post("{{BASE_URL}}/contact-us", formDataToSend, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     console.log("Success:", response.data);
//   } catch (error) {
//     console.error("Error submitting form:", error);
//   }
// };
// ************************
// const handleSubmit = (e) => {
//   e.preventDefault();
//   setIsLoading(true);
//   axios
//     .post(`${process.env.NEXT_PUBLIC_BASE_URL}/deshify-sale`, formData)
//     .then((res) => {
//       setFormData({
//         customer_name: "",
//         customer_number: "",
//         customer_email: "",
//         product_name: "",
//         product_details: "",
//         sale_price: "",
//         stock_quantity: "",
//         product_image: null,
//       });
//       toast(res.data.status_message, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: false,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//         transition: Bounce,
//       });
//       setIsLoading(false);
//     })
//     .catch((error) => {
//       if (error.response && error.response.status === 422) {
//         setError(error.response.data.errors);
//       }
//       setIsLoading(false);
//     });
// };
// *************************

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setFormData({ ...formData, productImage: e.target.files[0] });
//     }
//   };

//   return (
//     <div className="container py-4 my-2 bg-white shadow rounded">
//       <div className="row g-0">
//         <div className="col-lg-6 col-md-6 d-none d-md-flex d-flex align-items-center justify-content-center p-4">
//           <img src="/assets/images/banner/banner3.png" alt="Deshify Promotion" className="img-fluid h-100 w-100 object-fit-cover" />
//         </div>
//         <div className="col-lg-6 col-md-12 p-4">
//           <h2 className="text-dark fw-semibold mb-3 fw-bold text-muted text-center">Contact Us</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-3 d-flex">
//               <label className="form-label w-25 fw-bold text-muted">Name :</label>
//               <input
//                 type="text"
//                 className="form-control border-purple w-75"
//                 placeholder="Write your Name*"
//                 value={formData.customerName}
//                 onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
//               />
//             </div>

//             <div className="mb-3 d-flex">
//               <label className="form-label w-25 fw-bold text-muted">Phone :</label>
//               <input
//                 type="tel"
//                 className="form-control border-purple w-75"
//                 placeholder="Your Phone*"
//                 value={formData.phone}
//                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//               />
//             </div>

//             <div className="mb-3 d-flex">
//               <label className="form-label w-25 fw-bold text-muted">Email :</label>
//               <input
//                 type="email"
//                 className="form-control border-purple w-75"
//                 placeholder="Your Email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               />
//             </div>

//             <div className="mb-3 d-flex">
//               <label className="form-label w-25 fw-bold text-muted">Subject :</label>
//               <input
//                 type="text"
//                 className="form-control border-purple w-75"
//                 placeholder="Your Subject*"
//                 value={formData.productName}
//                 onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
//               />
//             </div>

//             <div className="mb-3 d-flex">
//               <label className="form-label w-25 fw-bold text-muted">Message :</label>
//               <textarea
//                 className="form-control border-purple w-75"
//                 placeholder="Write your message*"
//                 value={formData.productDetails}
//                 onChange={(e) => setFormData({ ...formData, productDetails: e.target.value })}
//                 rows={3}
//               />
//             </div>

//             <div className="mb-3 d-flex">
//               <label className="form-label w-25 fw-bold text-muted">Upload Image :</label>
//               <input type="file" className="form-control border-purple w-75" onChange={handleFileChange} />
//             </div>

//             <div className="mb-3 d-flex">
//               <div className="w-25"></div>
//               <div className="w-75">
//                 <ReCAPTCHA sitekey="your-recaptcha-site-key" onChange={() => {}} />
//               </div>
//             </div>

//             <div className="mb-3 d-flex">
//               <div className="w-25"></div>
//               <div className="w-75">
//                 <button type="submit" className="rounded py-2 px-4 mt-3 btn btn-outline-purple w-50">
//                   Send Message
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// ************************************************
"use client";

import { useState } from "react";
const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
});
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import dynamic from "next/dynamic";

export default function ContactForm() {
  const [token, setToken] = useState("");
  const [error, setError] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    details: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/contact-us`, formData)
      .then((res) => {
        setFormData({
          name: "",
          phone: "",
          email: "",
          subject: "",
          details: "",
        });
        toast(res.data.status_message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          setError(error.response.data.errors);
        }
        setIsLoading(false);
      });
  };

  const setTokenFunc = (getToken) => {
    setToken(getToken);
  };

  return (
    // <div className="container p-4 my-2 bg-white shadow rounded">
    //   <div className="row g-0">
    //     <div className="col-lg-6 col-md-6 d-none d-md-flex align-items-center justify-content-center p-4">
    //       <img src="/assets/images/banner/banner3.png" alt="Deshify Promotion" className="img-fluid w-100 rounded" />
    //     </div>
    //     <div className="col-lg-6 col-md-12 p-4">
    //       <h2 className="text-dark fw-bold mb-3 text-center fs-3">Contact Us</h2>
    //       <form onSubmit={handleSubmit}>
    //         {[
    //           { label: "Customer Name", field: "customer_name" },
    //           { label: "Phone", field: "customer_number", type: "tel" },
    //           { label: "Email", field: "customer_email", type: "email" },
    //           { label: "Subject", field: "subject" },
    //           { label: "Order ID", field: "order_id" },
    //         ].map(({ label, field, type = "text" }) => (
    //           <div className="mb-3 d-flex" key={field}>
    //             <label className="fw-bold text-muted form-label w-25">{label} :</label>
    //             <div className="w-75">
    //               <input
    //                 type={type}
    //                 className={`form-control border-purple w-100 ${error?.[field] ? "is-invalid" : ""}`}
    //                 placeholder={`Enter ${label}*`}
    //                 value={formData[field]}
    //                 onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
    //               />
    //               <p className="text-danger">
    //                 <small>{error?.[field]}</small>
    //               </p>
    //             </div>
    //           </div>
    //         ))}

    //         <div className="mb-3 d-flex">
    //           <label className="fw-bold text-muted form-label w-25">Message :</label>
    //           <div className="w-75">
    //             <textarea
    //               className={`form-control border-purple w-100 ${error?.message ? "is-invalid" : ""}`}
    //               placeholder="Write your message*"
    //               value={formData.message}
    //               onChange={(e) => setFormData({ ...formData, message: e.target.value })}
    //               rows={3}
    //             />
    //           </div>
    //           <p className="text-danger">
    //             <small>{error?.message}</small>
    //           </p>
    //         </div>

    //         <div className="mb-3 d-flex">
    //           <div className="w-25"></div>
    //           <div className="w-75">
    //             <ReCAPTCHA sitekey={process.env.RECAPTCHA_SITE_KEY} onChange={setTokenFunc} />
    //           </div>
    //         </div>
    //         <div className="mb-3 d-flex">
    //           <div className="w-25"></div>
    //           <div className="w-75">
    //             <button type="submit" disabled={isLoading} className="rounded py-2 px-4 mt-3 btn btn-outline-purple w-50">
    //               {isLoading ? (
    //                 <div className="text-center">
    //                   <div className="spinner-border spinner-border-sm" role="status">
    //                     <span className="visually-hidden">Loading...</span>
    //                   </div>
    //                 </div>
    //               ) : (
    //                 "Send Message"
    //               )}
    //             </button>
    //           </div>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // </div>

    <div className="container py-4 my-2 bg-white shadow rounded">
      <div className="row g-0">
        <div className="col-lg-6 col-md-6 d-none d-md-flex d-flex align-items-center justify-content-center p-4">
          {/* // <img src="/assets/images/banner/banner3.png" alt="Deshify Promotion" className="img-fluid h-100 w-100 object-fit-cover" /> */}
        </div>
        <div className="col-lg-6 col-md-12  p-4">
          <h1 className="text-dark fs-4 fw-semibold mb-3 fw-bold text-muted text-center">
            Contact Us
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 d-flex ">
              <label className="form-label w-25 fw-bold text-muted">
                Name :
              </label>
              <div className={"w-75"}>
                <input
                  type="text"
                  className={`form-control  border-purple w-100 ${
                    error?.name ? "is-invalid" : ""
                  }`}
                  placeholder="Write your Name*"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <p className={"text-danger"}>
                  <small>{error?.name}</small>
                </p>
              </div>
            </div>

            <div className="mb-3 d-flex">
              <label className="form-label w-25 fw-bold text-muted">
                Phone :
              </label>
              <div className={"w-75"}>
                <input
                  type="tel"
                  className={`form-control  border-purple w-100 ${
                    error?.phone ? "is-invalid" : ""
                  }`}
                  placeholder="Your Phone*"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                <p className={"text-danger"}>
                  <small>{error?.phone}</small>
                </p>
              </div>
            </div>

            <div className="mb-3 d-flex">
              <label className="form-label w-25 fw-bold text-muted">
                Email :
              </label>
              <div className={"w-75"}>
                <input
                  type="email"
                  className={`form-control  border-purple w-100 ${
                    error?.email ? "is-invalid" : ""
                  }`}
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <p className={"text-danger"}>
                  <small>{error?.email}</small>
                </p>
              </div>
            </div>

            <div className="mb-3 d-flex">
              <label className="form-label w-25 fw-bold text-muted">
                Subject :
              </label>
              <div className={"w-75"}>
                <input
                  type="text"
                  className={`form-control  border-purple w-100 ${
                    error?.subject ? "is-invalid" : ""
                  }`}
                  placeholder="Your Subject*"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                />
                <p className={"text-danger"}>
                  <small>{error?.subject}</small>
                </p>
              </div>
            </div>

            <div className="mb-3 d-flex">
              <label className="form-label w-25 fw-bold text-muted">
                Message :
              </label>
              <div className={"w-75"}>
                <textarea
                  className={`form-control  border-purple w-100 ${
                    error?.details ? "is-invalid" : ""
                  }`}
                  placeholder="Write your message*"
                  value={formData.details}
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <div className="mb-3 d-flex ">
              <div className="w-25"></div>
              <div className="w-75">
                <ReCAPTCHA
                  sitekey={process.env.RECAPTCHA_SITE_KEY}
                  onChange={setTokenFunc}
                />
              </div>
            </div>
            <div className="mb-3 d-flex ">
              <div className="w-25"></div>
              <div className="w-75">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded py-2 px-4 mt-3  btn btn-outline-purple w-50"
                >
                  {isLoading ? (
                    <div className="text-center">
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    `Send Message`
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
