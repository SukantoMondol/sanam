"use client";
import React, { useEffect } from "react";
import { Badge, Button, Col, Container, Modal, Row } from "react-bootstrap";
import AddAddress from "./AddAddress";
import UpdateAddress from "./UpdateAddress";
import { useState } from "react";

import axios from "axios";
import Loader from "@/components/UI/Shared/Loader";
import { AiOutlinePlus, AiFillDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";
import axiosInstance from "@/utils/axiosInstance";

const AddressBook = () => {
  const [editAddressId, setEditAddressId] = useState("");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [loader, setLoader] = useState(false);
  const [defaultAddressId, setDefaultAddressId] = useState("");
  const [addressDelete, setAddressDelete] = useState(false);

  const [newAddressData, setNewAddressData] = useState({
    name: "",
    phone: "",
    division_id: "",
    city_id: "",
    zone_id: "",
    zip_code: "",
    street_address: "",
    address_type: "1", // Default value is set to "Billing Address"
    is_default: null,
  });
  // update address
  const [editAddressData, setEditAddressData] = useState({
    name: "",
    id: "",
    phone: "",
    division_id: "",
    city_id: "",
    zone_id: "",
    zip_code: "",
    street_address: "",
    address_type: "",
    is_default: null,
  });

  const [viewAddress, setViewAddress] = useState([]);
  // Address View
  const address = () => {
    setLoader(true);
    if (getCookie("token")) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/all-addresses`, {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`, // Replace YOUR_TOKEN_HERE with your actual token
          },
        })
        .then((response) => {
          setLoader(false);
          setViewAddress(response.data.data);
        })
        .catch((error) => {});
    }
  };

  //  reload  address update
  useEffect(() => {
    address();
  }, [getCookie("token")]);

  // address edit modal
  const handleEditAddress = (id) => {
    setEditAddressId(id);
    setShow3(true);
    setShow(false);
    axiosInstance
      .get(`/get-address/${id}`)
      .then((response) => {
        const address = response.data?.data;
        setEditAddressData({
          id: address?.id,
          phone: address?.phone,
          division_id: address?.division_id,
          name: address?.name,
          city_id: address?.city_id,
          zone_id: address?.zone_id,
          zip_code: address?.zip_code,
          street_address: address?.street_address,
          address_type: address?.address_type,
          is_default: address?.is_default,
        });
        // Fetch city data based on the selected division
        axios
          .get(`${process.env.NEXT_PUBLIC_BASE_URL}/cities/${address.division_id}`, {
            headers: {
              Authorization: `Bearer ${getCookie("token")}`,
            },
          })
          .then((response) => {
            setCities(response.data?.data);
          })
          .catch((error) => {});
        // Fetch zone data based on the selected city
        axios
          .get(`${process.env.NEXT_PUBLIC_BASE_URL}/zones/${address.city_id}`, {
            headers: {
              Authorization: `Bearer ${getCookie("token")}`,
            },
          })
          .then((response) => {
            setZones(response.data?.data);
          })
          .catch((error) => {});
      })
      .catch((error) => {});
  };

  const [shouldFetchAddresses, setShouldFetchAddresses] = useState(false);
  // Callback function to handle address updated
  const handleAddressUpdated = () => {
    setShouldFetchAddresses(true);
  };

  // Fetch addresses only when shouldFetchAddresses is true
  useEffect(() => {
    if (shouldFetchAddresses) {
      address();
      setShouldFetchAddresses(false);
    }
  }, [shouldFetchAddresses]);

  // Callback function to handle default address selection
  const handleAddressSelection = (id) => {
    setDefaultAddressId(id);
    // Find the selected address from the shipping_address and office_address arrays
    const selectedAddress =
      viewAddress?.shipping_address?.find((address) => address.id === id) ||
      viewAddress?.office_address?.find((address) => address.id === id) ||
      viewAddress?.billing_address?.find((address) => address.id === id);

    // Update the viewAddress state with the selected address
    setViewAddress((prevState) => ({
      ...prevState,
      default: selectedAddress,
    }));
  };

  //default address
  const defaultAddressFunction = () => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/set-default-address/${defaultAddressId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`, // Replace YOUR_TOKEN_HERE with your actual token
          },
        }
      )
      .then((response) => {
        toast.success("Default Address Set Successfully");
        // Update the viewAddress state with the updated default address
        setViewAddress((prevAddress) => ({
          ...prevAddress,
          default: {
            ...prevAddress?.default,
            id: defaultAddressId, // Assuming the API response includes the ID of the default address
          },
        }));
        setShow(false);
      })
      .catch((error) => {});
  };

  //delete address
  const deleteAddress = (id) => {
    axiosInstance
      .delete(`/address/${id}`)
      .then((response) => {
        toast.success(response.data?.status_message);
        address();
      })
      .catch((error) => {});
  };

  // delete all address
  const deleteAllAddress = () => {
    // setLoader(true);
    axiosInstance
      .delete(`/delete-all-addresses`)
      .then((response) => {
        // setLoader(false);
        toast.success(response.data?.status_message);
        setAddressDelete(false);
        address();
      })
      .catch((error) => {});
  };

  if (loader) return <Loader />;

  return (
    <div className="p-4 addressBookContainer">
      <div className="d-flex justify-content-between">
        <h5 className="fe-bold text-muted">Address Book</h5>
        <button
          className="d-flex cursor addNewAddressButton"
          onClick={() => setShow2(true)}
        >
          <AiOutlinePlus className="me-1" /> Add New Address
        </button>
      </div>
      <hr className="my-4" />

      {viewAddress?.length > 0 && (
        <Row className="">
          <div className="d-flex justify-content-end">
            <button
              className="clearAllAddressButton bg-danger mb-1"
              onClick={() => setAddressDelete(true)}
            >
              Clear all Address
            </button>
          </div>
          {viewAddress?.map((data) => (
            <Col lg={6} sm={12} className="p-2" key={data?.id}>
              <div
                className="rounded p-2"
                style={{ height: "8rem", border: "1px solid #8280803a" }}
              >
                <div className="mx-2">
                  <div className="d-flex justify-content-between">
                    <p
                      className="m-1"
                      style={{ color: "#636262", fontSize: "13px" }}
                    >
                      {data?.name}
                    </p>
                    <div className="d-flex gap-2">
                      <p
                        className="m-1 cursor textHover2"
                        style={{
                          color: "#239bb5",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleEditAddress(data?.id)}
                      >
                        EDIT
                      </p>
                      <AiFillDelete
                        style={{ fontSize: "16px", cursor: "pointer" }}
                        className="mt-1 text-danger"
                        onClick={() => deleteAddress(data?.id)}
                      />
                    </div>
                  </div>
                  <p
                    className="m-1"
                    style={{ color: "#636262", fontSize: "13px" }}
                  >
                    {data?.phone}
                  </p>
                  <p
                    className="m-1"
                    style={{ color: "#636262", fontSize: "13px" }}
                  >
                    {data?.division_name},{data?.city_name},{data?.zone_name},
                    {data?.street_address}
                  </p>
                  <div className="d-flex gap-2">
                    {data?.address_type == 2 && (
                      <p style={{ fontSize: "13px" }}>
                        <Badge className="bg-secondary-color py-1 px-2">
                          Home
                        </Badge>
                      </p>
                    )}
                    {data?.address_type == 3 && (
                      <p style={{ fontSize: "13px" }}>
                        <Badge className="bg-secondary-color py-1 px-2">
                          Office
                        </Badge>
                      </p>
                    )}
                    {data?.is_default == 1 && (
                      <p style={{ fontSize: "13px" }}>
                        <Badge className="bg-purple py-1 px-2">
                          Default Shipping Address
                        </Badge>
                      </p>
                    )}
                  </div>

                  {/* <Button
                                    style={{ width: "200px", backgroundColor: 'var(--background-color' }}
                                    className={`${styles.btn} mt-3 `}
                                    onClick={() => setShow(true)}
                                >
                                    Change Address
                                </Button> */}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal 1 start all address view */}

      {/* Modal 1 end  all address view*/}

      {/* Modal 2 start add address */}
      <Modal show={show2} onHide={() => setShow2(false)} size="lg" centered>
        <Modal.Header
          closeButton
          // onClick={() => (setShow2(false))}
        >
          <h5 className="text-muted">Add New Address</h5>
        </Modal.Header>
        <Modal.Body>
          <AddAddress
            setShow={setShow}
            setShow2={setShow2}
            setShow3={setShow3}
            newAddressData={newAddressData}
            setNewAddressData={setNewAddressData}
            address={address}
          />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      {/* Modal 2 end  add address*/}

      {/* Modal 3 start address update  */}
      <Modal show={show3} onHide={() => setShow3(false)} size="lg" centered>
        <Modal.Header
          closeButton
          // onClick={() => (setShow3(false))}
        >
          <h5 className="text-muted">Update Address</h5>
        </Modal.Header>
        <Modal.Body>
          <UpdateAddress
            setShow={setShow}
            setShow3={setShow3}
            editAddressId={editAddressId}
            editAddressData={editAddressData}
            setEditAddressData={setEditAddressData}
            handleEditAddress={handleEditAddress}
            onAddressUpdated={handleAddressUpdated}
          />
        </Modal.Body>
      </Modal>
      {/* Modal 3 end  address update */}

      {/* Modal 4 start  default address */}
      <Modal
        show={addressDelete}
        onHide={() => setAddressDelete(false)}
        centered
      >
        <Modal.Body className="p-3">
          <p className=" text-muted ">
            Are you sure you want to delete all address?
          </p>
          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button
              variant="secondary"
              className={`bg-danger border-0`}
              onClick={() => setAddressDelete(false)}
            >
              Cancel
            </Button>
            <div className="btnDiv">
              <Button
                className={`btn bg-purple border-0`}
                onClick={deleteAllAddress}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* Modal 4 end  default address */}
    </div>
  );
};

export default AddressBook;
