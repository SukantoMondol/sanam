import React from "react";
import Link from "next/link";
import { Button, Table, Container } from "react-bootstrap";
import styles from "./orderlist.module.scss";
import ImageComponent from "@/components/UI/Cards/ImageComponent";

const OrderTable = ({ orderDetails, id, handleReviewClick }) => {
  return (
    <Table
      responsive
      className={`${styles.myOrder} ${styles.customTable} text-center`}
    >
      <thead>
        <tr>
          <th>Photo</th>

          <th>Name</th>
          <th>Attributes</th>
          <th>Quantity</th>
          {/* <th>Price</th>
                    <th>Discount</th> */}
          <th>Price</th>
          {id == 1 && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {orderDetails?.order_items?.map((item) => (
          <tr key={item?.id}>
            <td>
              <Link href={`/product-details/${item?.slug}`}>
                <ImageComponent
                  src={item?.photo}
                  height={40}
                  width={40}
                  alt="Order Item Image"
                />
              </Link>
            </td>
            <td>
              <Link
                href={`/product-details/${item?.slug}`}
                className="fw-bold text-muted  textHover"
              >
                {item?.name?.substring(0, 40)}
              </Link>
            </td>

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
            {/* <td>{item?.discount_amount}</td>
                        <td>{item?.payable_price}</td> */}
            {id == 1 && (
              <td>
                {" "}
                <div className="text-center mt-2 mb-3 btnDiv ">
                  <Button
                    className={` btn `}
                    onClick={() => handleReviewClick(item?.product_id)}
                  >
                    Review
                  </Button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default OrderTable;
