import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { toast } from 'react-toastify';
import {getCookie} from "cookies-next";

const AddAddress = ({ setShow, setShow2, setShow3, newAddressData, setNewAddressData, address }) => {

    const [divisions, setDivisions] = useState([]); // State to store divisions
    const [cities, setCities] = useState([]); // State to store cities
    const [zones, setZones] = useState([]); // State to store zones
    const [errors, setErrors] = useState({});

    // get all division list from database
    useEffect(() => {
        if (getCookie("token")) {
            axios
                .get(`${process.env.NEXT_PUBLIC_BASE_URL}/divisions`, {
                    headers: {
                        Authorization: `Bearer ${getCookie("token")}`, // Replace YOUR_TOKEN_HERE with your actual token
                    },
                })
                .then((response) => {
                    setDivisions(response.data);

                })
                .catch((error) => {
                });
        }
    }, [getCookie("token")]);

    // division change and set city 
    const handleDivisionChange = (e) => {
        const selectedDivisionId = e.target.value;
        setNewAddressData((prevAddressData) => ({
            ...prevAddressData,
            division_id: selectedDivisionId,
        }));

        // Fetch zone data based on the selected division
        axios
            .get(`${process.env.NEXT_PUBLIC_BASE_URL}/cities/${selectedDivisionId}`, {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`, // Replace YOUR_TOKEN_HERE with your actual token
                },
            })
            .then((response) => {
                setCities(response.data?.data);
            })
            .catch((error) => {
            });
    };

    // city change and set zone 
    const handleCityChange = (e) => {
        const selectedCityId = e.target.value;
        setNewAddressData((prevAddressData) => ({
            ...prevAddressData,
            city_id: selectedCityId,
        }));

        // Fetch zone data based on the selected city
        axios
            .get(`${process.env.NEXT_PUBLIC_BASE_URL}/zones/${selectedCityId}`, {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`, // Replace YOUR_TOKEN_HERE with your actual token
                },
            })
            .then((response) => {
                setZones(response.data?.data);
            })
            .catch((error) => {
            });
    };

    // zone change 
    const handleZoneChange = (e) => {
        const selectedZoneId = e.target.value;
        setNewAddressData({ ...newAddressData, zone_id: selectedZoneId });
    };

    // Add address to database
    const handleAddAddress = () => {
        const validationErrors = {};

        if (!newAddressData.name) {
            validationErrors.name = 'Full Name is required';
        }

        if (!newAddressData.phone) {
            validationErrors.phone = 'Mobile Number is required';
        }

        if (!newAddressData.street_address) {
            validationErrors.street_address = 'House Address is required';
        }

        if (!newAddressData.division_id) {
            validationErrors.division_id = 'Division is required';
        }

        if (!newAddressData.city_id) {
            validationErrors.city_id = 'District is required';
        }
        if (!newAddressData.zone_id) {
            validationErrors.zone_id = 'City/Zone is required';
        }

        // Check if there are any validation errors
        if (Object.keys(validationErrors).length === 0) {
            // No validation errors, proceed with the address submission
            axios
                .post(`${process.env.NEXT_PUBLIC_BASE_URL}/address`, newAddressData, {
                    headers: {
                        Authorization: `Bearer ${getCookie("token")}`, // Replace YOUR_TOKEN_HERE with your actual token
                    },
                })
                .then((response) => {
                    address();
                    toast.success("Address Added Successfully...");

                    // Reset the form
                    setNewAddressData({
                        name: '',
                        phone: "",
                        division_id: "",
                        city_id: "",
                        zone_id: "",
                        zip_code: "",
                        street_address: "",
                        address_type: "1", // Reset the streetType to "Billing Address"
                    });
                    // Close the modal and reset the form
                    setShow2(false);
                    setShow3(false);
                    // setShow(true);
                })
                .catch((error) => {
                    // Handle any errors that occur during the request
                    toast.error(error?.response?.data?.message);
                });
        } else {
            // Set the validation errors
            setErrors(validationErrors);
        }
        // Perform any desired operations with newAddressData
    };

    return (
        <div>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Full Name <span className='text-danger'>*</span> </Form.Label>
                        <Form.Control
                            type="text"
                            required
                            value={newAddressData.name}
                            onChange={(e) =>
                                setNewAddressData({
                                    ...newAddressData,
                                    name: e.target.value,
                                })
                            }
                        />
                        {errors.name && <p className="text-danger">{errors.name}</p>}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="phoneNumberInput">
                        <Form.Label>Mobile Number <span className='text-danger'>*</span></Form.Label>
                        <Form.Control
                            type="text"
                            required
                            value={newAddressData.phone}
                            onChange={(e) =>
                                setNewAddressData({
                                    ...newAddressData,
                                    phone: e.target.value,
                                })
                            }
                        />
                        {errors.phone && <p className="text-danger">{errors.phone}</p>}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="addressInput">
                        <Form.Label>House Address <span className='text-danger'>*</span></Form.Label>
                        <Form.Control
                            type="text"
                            required
                            value={newAddressData.street_address}
                            onChange={(e) =>
                                setNewAddressData({
                                    ...newAddressData,
                                    street_address: e.target.value,
                                })
                            }
                        />
                        {errors.street_address && <p className="text-danger">{errors.street_address}</p>}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="divisionInput">
                        <Form.Label>Division <span className='text-danger'>*</span></Form.Label>
                        <Form.Control
                            as="select"
                            required
                            value={newAddressData.division_id}
                            onChange={handleDivisionChange}
                        >
                            <option value="">Select a Division</option>
                            {divisions?.data?.map((division) => (
                                <option key={division?.id} value={division?.id}>
                                    {division?.name}
                                </option>
                            ))}
                        </Form.Control>
                        {errors.division_id && <p className="text-danger">{errors.division_id}</p>}
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="cityInput">
                        <Form.Label>District <span className='text-danger'>*</span></Form.Label>
                        <Form.Control
                            as="select"
                            required
                            value={newAddressData.city_id}
                            onChange={handleCityChange}
                            disabled={!newAddressData.division_id}
                        >
                            <option value="">Select a district</option>
                            {cities?.map((city) => (
                                <option key={city?.id} value={city?.id}>
                                    {city?.city_name}
                                </option>
                            ))}
                        </Form.Control>
                        {errors.city_id && <p className="text-danger">{errors.city_id}</p>}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="zoneInput">
                        <Form.Label>City/Zone <span className='text-danger'>*</span></Form.Label>
                        <Form.Control
                            as="select"
                            required
                            value={newAddressData.zone_id}
                            onChange={handleZoneChange}
                            disabled={!newAddressData.city_id}
                        >
                            <option value="">Select a city/zone</option>
                            {zones?.map((zone) => (
                                <option key={zone?.id} value={zone?.id}>
                                    {zone?.zone_name}
                                </option>
                            ))}
                        </Form.Control>
                        {errors.zone_id && <p className="text-danger">{errors.zone_id}</p>}

                    </Form.Group>
                    <Form.Group className="mb-3" controlId="streetTypeInput">
                        <Form.Label>Select a label for effective delivery: <span className='text-danger'>*</span></Form.Label>
                        <div className=' d-flex  gap-4'
                        >
                            <div className={newAddressData.address_type == 2 ? 'btnDiv w-100' : 'btnDiv2 w-100'} >
                                <Button
                                    className='w-100 btn'
                                    onClick={() =>
                                        setNewAddressData({
                                            ...newAddressData,
                                            address_type: "2", // Home Address
                                        })
                                    }
                                >
                                    Home
                                </Button>
                            </div>
                            <div className={newAddressData.address_type == 3 ? 'btnDiv w-100' : 'btnDiv2 w-100'} >
                                <Button
                                    className='w-100 btn'
                                    onClick={() =>
                                        setNewAddressData({
                                            ...newAddressData,
                                            address_type: "3", // Office Address
                                        })
                                    }
                                >
                                    Office
                                </Button>
                            </div>
                        </div>
                    </Form.Group>
                    <div className="form-check">
                        <input onClick={() => {
                            setNewAddressData({
                                ...newAddressData,
                                is_default: !newAddressData.is_default,
                            })
                        }} className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked={newAddressData.is_default} />
                        <label className="form-check-label" htmlFor="flexCheckChecked">
                            Set as default address {newAddressData.is_default}
                        </label>
                    </div>
                </Col>
            </Row>



            {/* <Form.Group className="mb-3" controlId="streetTypeInput">
                <Form.Label>Address Type</Form.Label>
                <Form.Control
                    as="select"
                    value={newAddressData.address_type}
                    onChange={(e) =>
                        setNewAddressData({
                            ...newAddressData,
                            address_type: e.target.value,
                        })
                    }
                >
                    <option value="1">Billing Address</option>
                    <option value="2">Shipping Address</option>
                    <option value="3">Office Address</option>
                </Form.Control>
            </Form.Group> */}

            <div className='d-flex justify-content-end gap-4'>
                <div>
                    <Button
                        variant="secondary"
                        onClick={() => (setShow2(false))}
                    >
                        Cancel
                    </Button>
                </div>
                <div className='btnDiv'>
                    <Button
                    className='btn'
                        onClick={handleAddAddress}
                    >
                        Save Address
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AddAddress