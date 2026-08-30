import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/auth";
import { Button, Container, Table } from "react-bootstrap";
import Link from "next/link";
import Loader from "../../loader/Loader";
import axiosInstance from "@/utils/axiosInstance";

const OrderList = ({type}) => {
  const { auth } = useAuth();
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
    if (auth?.token) {
      orderData();
    }
  }, [auth?.token]);

  if (loader) return <Loader />;

  return (
    <div className={`myOrder ${type==='footer' && 'marginTop'} `}>
      <Container className={`${type==='footer' && 'pt-3' }`}>
        <Table size="sm" bordered hover responsive className={`text-center mt-2`}>
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
                    <Link href={`/order-details/${item?.id}`} className="btnDiv" >
                      <Button
                        className={`btn`}
                      >
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
