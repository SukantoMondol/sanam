import React, { useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import styles from "./Checkout.module.scss";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/auth';
import {getCookie} from "cookies-next";



const AllAddress = ({ viewAddress, address, handleEditAddress, onAddressSelected }) => {
    const { auth } = useAuth();
    const [selectedColId, setSelectedColId] = useState(null);

    //delete address
    const deleteAddress = (id) => {
        axios
            .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/address/${id}`, {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`, // Replace YOUR_TOKEN_HERE with your actual token
                },
            })
            .then((response) => {
                toast.success(response.data?.status_message);
                address();
            })
            .catch((error) => {
            });
    };

    // handle address selection

    const handleColClick = (id) => {
        setSelectedColId(id);
        onAddressSelected(id);

    };

    return (
        <div className={`${styles.allAddress}`}>
            {viewAddress?.shipping_address?.length > 0 && (
                <Row className={styles.row}>
                    <h6 className="fw-bold">Shipping Address</h6>
                    {viewAddress?.shipping_address?.map((data) => (
                        <Col
                            xs={6} lg={4}
                            key={data?.id}
                            className={`${styles.col} `}>
                            <div className={` ${styles.content} ${selectedColId === data?.id ? styles.selectedCol : ''} shadow p-3`} onClick={() => handleColClick(data?.id)}
                            >
                                <div>
                                    <p className='m-0'>
                                        Name: {data?.name}
                                    </p>
                                    <p className='m-0'>
                                        Phone: {data?.phone}
                                    </p>
                                    <p className='m-0'>
                                        Address: {data?.division_name} {data?.city_name} {data?.zone_name} {data?.street_address}
                                    </p>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <AiFillEdit
                                        style={{ fontSize: "15px", cursor: 'pointer' }}
                                        className=""
                                        onClick={() => handleEditAddress(data?.id)}
                                    />
                                    <AiFillDelete
                                        style={{ fontSize: "15px", cursor: 'pointer' }}
                                        className="mx-2"
                                        onClick={() => deleteAddress(data?.id)}
                                    />
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}

            {viewAddress?.billing_address?.length > 0 && (
                <Row className={styles.row}>
                    <h6 className="fw-bold mt-3">Billing Address</h6>
                    {viewAddress?.billing_address?.map((data) => (
                        <Col
                            xs={6} lg={4}
                            key={data?.id}
                            className={`${styles.col} `}>
                            <div className={` ${styles.content} ${selectedColId === data?.id ? styles.selectedCol : ''} shadow p-3`} onClick={() => handleColClick(data?.id)}
                            >
                                <div>
                                    <p className='m-0'>
                                        Name: {data?.name}
                                    </p>
                                    <p className='m-0'>
                                        Phone: {data?.phone}
                                    </p>
                                    <p className='m-0'>
                                        Address: {data?.division_name} {data?.city_name} {data?.zone_name} {data?.street_address}
                                    </p>

                                </div>
                                <div className="d-flex justify-content-end">
                                    <AiFillEdit
                                        style={{ fontSize: "15px", cursor: 'pointer' }}
                                        className=""
                                        onClick={() => handleEditAddress(data?.id)}
                                    />
                                    <AiFillDelete
                                        style={{ fontSize: "15px", cursor: 'pointer' }}
                                        className="mx-2"
                                        onClick={() => deleteAddress(data?.id)}
                                    />
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}

            {viewAddress?.office_address?.length > 0 && (
                <Row className={styles.row}>
                    <h6 className="fw-bold mt-3">Office Address</h6>
                    {viewAddress?.office_address?.map((data) => (
                        <Col
                            xs={6} lg={4}
                            key={data?.id}
                            className={`${styles.col} `}>
                            <div className={` ${styles.content} ${selectedColId === data?.id ? styles.selectedCol : ''} shadow p-3`} onClick={() => handleColClick(data?.id)}
                            >
                                <div>
                                    <p className='m-0'>
                                        Name: {data?.name}
                                    </p>
                                    <p className='m-0'>
                                        Phone: {data?.phone}
                                    </p>
                                    <p className='m-0'>
                                        Address: {data?.division_name} {data?.city_name} {data?.zone_name} {data?.street_address}
                                    </p>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <AiFillEdit
                                        style={{ fontSize: "15px", cursor: 'pointer' }}
                                        className=""
                                        onClick={() => handleEditAddress(data?.id)}
                                    />
                                    <AiFillDelete
                                        style={{ fontSize: "15px", cursor: 'pointer' }}
                                        className="mx-2"
                                        onClick={() => deleteAddress(data?.id)}
                                    />
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}

            {!viewAddress?.shipping_address &&
                !viewAddress?.billing_address &&
                !viewAddress?.office_address && <h2>No address found</h2>}


        </div>
    )
}

export default AllAddress