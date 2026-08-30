import React from "react";
import { Badge, Container, Table } from "react-bootstrap";
import { FaCircle, FaPhoneAlt } from "react-icons/fa";

const Print = ({ orderDetails, componentRef }) => {
  return (
    <Container ref={componentRef} style={{ marginTop: "10rem" }}>
      <div className="d-flex justify-content-between">
        <div>
          <ul className="list-unstyled">
            <li className="text-muted fw-bold">Ship To: </li>
            <li className="text-muted">{orderDetails?.customer_name}</li>
            <li className="text-muted">
              {orderDetails?.shipping_address?.zone}{" "}
              {orderDetails?.shipping_address?.city}{" "}
              {orderDetails?.shipping_address?.division}
            </li>
            <li className="text-muted">
              {orderDetails?.shipping_address?.street_address}
            </li>
            <li className="text-muted">
              <FaPhoneAlt /> {orderDetails?.shipping_address?.phone}
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
        </div>
        <div>
          <ul className="list-unstyled">
            <li className="text-muted">
              <FaCircle style={{ color: "#84B0CA" }} />{" "}
              <span className="fw-bold">Invoice No:</span>{" "}
              {orderDetails?.order_no}
            </li>
            <li className="text-muted mt-2">
              <FaCircle style={{ color: "#84B0CA" }} />{" "}
              <span className="fw-bold">Order Date:</span>{" "}
              {orderDetails?.created_at}
            </li>
            <li className="text-muted mt-2">
              <FaCircle style={{ color: "#84B0CA" }} />{" "}
              <span className="me-1 fw-bold">Order Status:</span>
              <Badge bg="success" text="white" className="fw-bold">
                {orderDetails?.order_status}
              </Badge>
            </li>
            <li className="text-muted mt-2">
              <FaCircle style={{ color: "#84B0CA" }} />{" "}
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
        </div>
      </div>
      {/* <Row>
                <Col xl={8}>
                    <ul className="list-unstyled">
                        <li className="text-muted fw-bold">Ship To: </li>
                        <li className="text-muted">{orderDetails?.customer_name}</li>
                        <li className="text-muted">{orderDetails?.shipping_address?.zone} {orderDetails?.shipping_address?.city} {orderDetails?.shipping_address?.division}</li>
                        <li className="text-muted">{orderDetails?.shipping_address?.street_address}</li>
                        <li className="text-muted"><FaPhoneAlt />
 {orderDetails?.shipping_address?.phone}</li>

                    </ul>
                </Col>
                <Col xl={4}>
                    <ul className="list-unstyled">
                        <li className="text-muted">
                            <FaCircle style={{ color: "#84B0CA" }} />{" "} <span className="fw-bold">Invoice No:</span> {orderDetails?.order_no}
                        </li>
                        <li className="text-muted mt-2">
                           <FaCircle style={{ color: "#84B0CA" }} />{" "} <span className="fw-bold">Order Date:</span> {orderDetails?.created_at}
                        </li>
                        <li className="text-muted mt-2">
                            <FaCircle style={{ color: "#84B0CA" }} />{" "} <span className="me-1 fw-bold">Order Status:</span>
                            <Badge bg="success" text="white" className="fw-bold">
                                {orderDetails?.order_status}
                            </Badge>
                        </li>
                        <li className="text-muted mt-2">
                            <FaCircle style={{ color: "#84B0CA" }} />{" "} <span className="me-1 fw-bold">Payment Status:</span>
                            {orderDetails?.payment_status === 'Unpaid' && <Badge bg="warning" text="black" className="fw-bold">
                                Unpaid
                            </Badge>}
                            {orderDetails?.payment_status === 'Paid' && <Badge bg="success" text="white" className="fw-bold">
                                Unpaid
                            </Badge>}
                            {orderDetails?.payment_status === 'Partially Paid' && <Badge bg="success" text="white" className="fw-bold">
                                Unpaid
                            </Badge>}
                        </li>

                    </ul>
                </Col>
            </Row> */}

      <Table className="mt-3">
        <thead>
          <tr>
            <th>Photo</th>

            <th>Name</th>
            <th>Attributes</th>
            <th>Quantity</th>
            {/* <th>Price</th>
                    <th>Discount</th> */}
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails?.order_items?.map((item) => (
            <tr key={item?.id}>
              <td>
                <img
                  src={item?.photo}
                  height={40}
                  width={40}
                  alt="Order Item Image"
                />
              </td>
              <td>{item?.name?.substring(0, 40)}</td>

              <td>
                {item?.order_items_attributes?.map((attr) => (
                  <span key={attr?.id} style={{ marginLeft: "15px" }}>
                    {attr?.name} : {attr?.value}
                    <br />
                  </span>
                ))}
              </td>
              <td>{item?.quantity}</td>
              <td>{item?.unit_price}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* <div className='mt-3'>
                <OrderTable orderDetails={orderDetails} />
            </div> */}

      <div className="d-flex justify-content-between">
        <div className="d-flex flex-end mt-auto">
          <p>
            NB: This invoice will be used as a Warranty Card from purchase date{" "}
            {orderDetails?.created_at}
          </p>
        </div>
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

      <hr />
    </Container>
  );
};

export default Print;
