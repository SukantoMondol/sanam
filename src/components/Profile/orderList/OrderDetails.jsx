import React, { useRef } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import styles from "./orderlist.module.scss";
import { useAuth } from "../../../context/auth";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Rating from "react-rating";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { toast } from "react-toastify";
import Image from "next/image";
import { ImCross } from "react-icons/im";
import Loader from "../../loader/Loader";
import OrderTable from "./OrderTable";
import { AiFillPrinter } from "react-icons/ai";
import { BsFiletypePdf } from "react-icons/bs";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";
import Print from "./Print";
import { pdf, Document, Page, Text } from "react-pdf";
import ImageComponent from "@/components/UI/Cards/ImageComponent";
import { FaPhoneAlt } from "react-icons/fa";

const OrderDetails = () => {
  const { auth } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [rating, setRating] = useState();
  const [details, setDetails] = useState("");
  const [image, setImage] = useState(null);
  const [itemId, setItemId] = useState();
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  const [loader, setLoader] = useState(false);

  const orderData = async () => {
    setLoader(true);
    try {
      const GetData = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/my-order-details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`, // Replace YOUR_TOKEN_HERE with your actual token
          },
        }
      );
      setOrderDetails(GetData?.data?.data);
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (auth?.token && id) {
      orderData();
    }
  }, [auth?.token, id]);

  const handleReviewClick = (itemId) => {
    // Set the item ID in the state and show the modal
    setItemId(itemId);
    setShowModal(true);
  };

  // Function to handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // The reader's result contains the Base64 encoded image
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
    }
  };

  // review
  const handleSaveReview = async () => {
    // Disable the "Save" button
    setSaveButtonClicked(true);
    try {
      const formData = new FormData();
      // formData.append('product_id', id); // Replace with the appropriate product ID
      formData.append("review_star", rating);
      formData.append("review", details);
      formData.append("photo", image);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/product-review?product_id=${itemId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      // Close the modal
      setShowModal(false);
      toast.success("Product Review Successfully Done");
      setImage(null);
      setRating(0);
      setDetails("");
      setSaveButtonClicked(false);
    } catch (error) {
      // Handle errors, show an error message, or update the UI accordingly
      toast.error(error?.response?.data?.message);
      setSaveButtonClicked(false);
    }
  };

  const printPage = () => {
    window.print();
  };
  const componentRef = useRef();

  // const handlePrint = async () => {
  //     const payload = {
  //         type: "print",
  //         order_ids: [orderDetails?.id]
  //     };
  //     const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/order-mass-action`, payload, {
  //         headers: {
  //             Authorization: `Bearer ${auth?.token}`,
  //         },
  //     });
  // }
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (loader) return <Loader />;

  return (
    <div className="marginTop">
      <div className="card-body">
        <Container className="mb-5 mt-3">
          <div className="invoice-wrapper" style={{ display: "none" }}>
            {/* Reference the Print component using the ref */}
            <Print orderDetails={orderDetails} componentRef={componentRef} />
          </div>
          <div className="d-flex justify-content-end btnDiv">
            <Button
              className="text-capitalize border-0 mx-3 "
              onClick={handlePrint}
            >
              <AiFillPrinter /> Print
            </Button>

            {/* <Button className="text-capitalize" style={{ backgroundColor: 'var(--background-color)', border: 'none', padding: '5px 30px' }}>
                            <BsFiletypePdf /> PDF
                        </Button> */}
          </div>
          <hr />

          <Container>
            <Row>
              <Col md={8}>
                <ul className="list-unstyled">
                  <li className="text-muted fw-bold">Ship To: </li>
                  <li className="text-muted ">{orderDetails?.customer_name}</li>
                  <li className="text-muted">
                    {orderDetails?.shipping_address?.zone}{" "}
                    {orderDetails?.shipping_address?.city}{" "}
                    {orderDetails?.shipping_address?.division}
                  </li>
                  <li className="text-muted">
                    {orderDetails?.shipping_address?.street_address}
                  </li>
                  <li className="text-muted">
                    <FaPhoneAlt />
                    {orderDetails?.shipping_address?.phone}
                  </li>
                  <li className="text-muted fw-bold">
                    <span>
                      Courier:{" "}
                      {orderDetails?.courier ? (
                        <>
                          <Badge bg="success" text="white" className="fw-bold">
                            {orderDetails?.courier}
                          </Badge>
                        </>
                      ) : (
                        <Badge bg="warning" text="black" className="fw-bold">
                          Processing
                        </Badge>
                      )}
                    </span>
                  </li>
                </ul>
              </Col>
              <Col md={4}>
                <ul className="list-unstyled text-md-end">
                  <li className="text-muted">
                    <span className="fw-bold">Invoice No:</span>{" "}
                    {orderDetails?.id}
                  </li>
                  <li className="text-muted mt-2">
                    <span className="fw-bold">Order Date:</span>{" "}
                    {orderDetails?.created_at}
                  </li>
                  <li className="text-muted mt-2">
                    <span className="me-1 fw-bold">Order Status:</span>
                    <Badge bg="success" text="white" className="fw-bold">
                      {orderDetails?.order_status}
                    </Badge>
                  </li>
                  <li className="text-muted mt-2">
                    <i
                      className="fas fa-circle"
                      style={{ color: "#84B0CA" }}
                    ></i>{" "}
                    <span className="me-1 fw-bold">Payment Status:</span>
                    {orderDetails?.payment_status === "Unpaid" && (
                      <Badge bg="warning" text="black" className="fw-bold">
                        Unpaid
                      </Badge>
                    )}
                    {orderDetails?.payment_status === "Paid" && (
                      <Badge bg="success" text="white" className="fw-bold">
                        Unpaid
                      </Badge>
                    )}
                    {orderDetails?.payment_status === "Partially Paid" && (
                      <Badge bg="success" text="white" className="fw-bold">
                        Unpaid
                      </Badge>
                    )}
                  </li>
                </ul>
              </Col>
            </Row>

            <div className="mt-3">
              <OrderTable
                orderDetails={orderDetails}
                id={1}
                handleReviewClick={handleReviewClick}
              />
            </div>

            <div className="d-flex justify-content-between">
              <div className="d-flex flex-end mt-auto d-none d-lg-block">
                <p>
                  NB: This invoice will be used as a Warranty Card from purchase
                  date {orderDetails?.created_at}
                </p>
              </div>
              <div className="d-block d-lg-none"></div>
              <div>
                <ul className="list-unstyled">
                  <li className="text-muted d-flex justify-content-between">
                    <span className="fw-bold">Sub Total:</span>KD 
                    {orderDetails?.total_amount}
                  </li>
                  <li className="text-muted d-flex justify-content-between gap-5">
                    <span className="fw-bold">Shipping Charge:</span>KD 
                    {orderDetails?.shipping_charge}
                  </li>
                  <li className="text-muted d-flex justify-content-between">
                    <span className="fw-bold">Discount:</span>KD 
                    {orderDetails?.total_discount_amount}
                  </li>
                  <li className="text-muted d-flex justify-content-between">
                    <span className="fw-bold">Grand Total:</span>KD 
                    {orderDetails?.total_payable_amount}
                  </li>
                </ul>
              </div>
            </div>

            {/* <Row style={{ marginTop: '-6rem' }}>
                            <Col xl={8} className='d-flex flex-end mt-auto'>
                                <p>NB: This invoice will be used as a Warranty Card from purchase date {orderDetails?.created_at}</p>
                            </Col>
                            <Col xl={3} className=''>
                                <ul className="list-unstyled">
                                    <li className="text-muted d-flex justify-content-between">
                                        <span className="fw-bold">Sub Total:</span>
                                        KD {orderDetails?.total_amount}
                                    </li>
                                    <li className="text-muted d-flex justify-content-between">
                                        <span className="fw-bold">Shipping Charge:</span>
                                        KD {orderDetails?.shipping_charge}
                                    </li>
                                    <li className="text-muted d-flex justify-content-between">
                                        <span className="fw-bold">Discount:</span>
                                        KD {orderDetails?.total_discount_amount}
                                    </li>
                                    <li className="text-muted d-flex justify-content-between">
                                        <span className="fw-bold">Grand Total:</span>
                                        KD {orderDetails?.total_payable_amount}
                                    </li>
                                </ul>
                            </Col>
                        </Row> */}

            <hr />
            <div className="d-block d-lg-none">
              <p>
                NB: This invoice will be used as a Warranty Card from purchase
                date {orderDetails?.created_at}
              </p>
            </div>
          </Container>
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            animation={true}
            dialogClassName={styles.modalDialog}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <b>Add Review</b>
              </Modal.Title>
            </Modal.Header>
            <div className={`${styles.login}`}>
              <Container>
                <Form className="mb-5 mt-3">
                  <Rating
                    placeholderRating={rating}
                    onChange={(rate) => setRating(rate)}
                    emptySymbol={
                      <AiOutlineStar
                        style={{ color: "#deb151", fontSize: "30px" }}
                      />
                    }
                    placeholderSymbol={
                      <AiFillStar
                        style={{ color: "#deb151", fontSize: "30px" }}
                      />
                    }
                    fullSymbol={
                      <AiFillStar
                        style={{ color: "#deb151", fontSize: "30px" }}
                      />
                    }
                  />
                  <Form.Group as={Row} controlId="image" className="mt-2">
                    <div className="text-center w-100">
                      {image && (
                        <ImageComponent
                          src={image}
                          alt="Uploaded"
                          style={{ maxWidth: "100px", margin: "0 auto 10px" }}
                        />
                      )}
                    </div>
                    <Form.Label column sm="3">
                      Product Image :
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        // onChange={(e) => setImage(e.target.files[0])}
                        required
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="message" className="mt-2">
                    <Form.Label column sm="3">
                      Review :
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Write Your Review*"
                        onChange={(e) => setDetails(e.target.value)}
                        required
                      />
                    </Col>
                  </Form.Group>
                </Form>
              </Container>
            </div>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button
                style={{ backgroundColor: "#239BB5" }}
                disabled={saveButtonClicked}
                onClick={handleSaveReview}
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default OrderDetails;
