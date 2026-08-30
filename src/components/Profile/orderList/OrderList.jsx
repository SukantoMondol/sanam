"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import styles from "./orderlist.module.scss";
import Link from "next/link";
import Loader from "@/components/UI/Shared/Loader";
import { getCookie } from "cookies-next";
import axiosInstance from "@/utils/axiosInstance";

const OrderList = ({ type }) => {
  const [allOrder, setAllOrder] = useState([]);
  const [loader, setLoader] = useState(false);

  const orderData = async () => {
    setLoader(true);
    try {
      const GetData = await axiosInstance.get(`/my-orders`);
      setAllOrder(GetData?.data?.data);
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (getCookie("token")) {
      orderData();
    }
  }, [getCookie("token")]);

  if (loader) return <Loader />;

  return (
    <div
      className={`${styles.myOrder} ${
        type === "footer" && "marginTop"
      } orderListPageContainer`}
    >
      <Container className={`${type === "footer" && "pt-3"}`}>
        <Table
          size="sm"
          bordered
          hover
          responsive
          className={`text-center my-3 `}
        >
          <thead>
            <tr className="border">
              <th>Order No</th>
              {/* <th>Customer Name</th> */}

              <th>Date</th>
              <th>Order </th>
              <th>Payment </th>
              {/* <th>Shipping</th> */}
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {allOrder?.data?.map((item) => (
              <tr key={item?.id}>
                <td>{item?.id}</td>
                {/* <td>{item?.customer_name}</td> */}
                <td>{item?.created_at}</td>
                <td>{item?.order_status}</td>
                <td>{item?.payment_status}</td>
                {/* <td>{item?.shipping_status}</td> */}
                <td>KD {item?.order_total}</td>
                <td>
                  <div className="text-center m-2 ">
                    <Link
                      href={`/order-details/${item?.id}`}
                      className="btnDiv"
                    >
                      <Button className={`btn`}>
                        <small>View</small>
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default OrderList;
