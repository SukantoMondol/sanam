import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "@/components/UI/Shared/Loader";
import { getCookie } from "cookies-next";
import axiosInstance from "@/utils/axiosInstance";

const UpdateAddress = ({
  editAddressId,
  setShow3,
  setShow,
  editAddressData,
  setEditAddressData,
  handleEditAddress,
  onAddressUpdated,
}) => {
  const [divisions, setDivisions] = useState([]);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [loader, setLoader] = useState(false);

  // Fetch divisions from the server
  useEffect(() => {
    setLoader(true);
    axiosInstance
      .get(`/divisions`)
      .then((response) => {
        setDivisions(response.data?.data);
        setLoader(false);
      })
      .catch((error) => {});
  }, [getCookie("token")]);

  // Fetch cities based on the selected division
  useEffect(() => {
    if (editAddressData.division_id) {
      axiosInstance
        .get(`/cities/${editAddressData?.division_id}`)
        .then((response) => {
          setCities(response.data?.data);
        })
        .catch((error) => {});
    }
  }, [editAddressData.division_id, getCookie("token")]);

  // Fetch zones based on the selected city
  useEffect(() => {
    if (editAddressData.city_id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/zones/${editAddressData.city_id}`, {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        })
        .then((response) => {
          setZones(response.data?.data);
        })
        .catch((error) => {});
    }
  }, [editAddressData.city_id, getCookie("token")]);

  // update address
  const handleUpdateAddress = () => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/address/${editAddressId}`,
        editAddressData,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      )
      .then((response) => {
        // Call the callback function to update the address in the parent component
        onAddressUpdated(editAddressId, editAddressData);
        toast.success("Address updated successfully!");
        setShow3(false);
      })
      .catch((error) => {});
  };

  if (loader) return <Loader />;

  return (
    <div className="updateAddressContainer">
      <Row>
        <Col sm="12" md="6">
          <Form.Group className="mb-3" controlId="zipCodeInput">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={editAddressData.name}
              onChange={(e) =>
                setEditAddressData({
                  ...editAddressData,
                  name: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="phoneNumberInput">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              value={editAddressData.phone}
              onChange={(e) =>
                setEditAddressData({
                  ...editAddressData,
                  phone: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="addressInput">
            <Form.Label>House Address</Form.Label>
            <Form.Control
              type="text"
              value={editAddressData.street_address}
              onChange={(e) =>
                setEditAddressData({
                  ...editAddressData,
                  street_address: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="divisionInput">
            <Form.Label>Division</Form.Label>
            <Form.Control
              as="select"
              value={editAddressData.division_id}
              onChange={(e) =>
                setEditAddressData({
                  ...editAddressData,
                  division_id: e.target.value,
                })
              }
            >
              <option value="">Select a Division</option>
              {divisions?.map((division) => (
                <option key={division?.id} value={division?.id}>
                  {division?.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col sm="12" md="6">
          <Form.Group className="mb-3" controlId="cityInput">
            <Form.Label>District</Form.Label>
            <Form.Control
              as="select"
              value={editAddressData?.city_id}
              onChange={(e) =>
                setEditAddressData({
                  ...editAddressData,
                  city_id: e.target.value,
                })
              }
            >
              <option value="">Select a city</option>
              {cities?.map((city) => (
                <option key={city?.id} value={city?.id}>
                  {city?.city_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="zoneInput">
            <Form.Label>City/Zone</Form.Label>
            <Form.Control
              as="select"
              value={editAddressData.zone_id}
              onChange={(e) =>
                setEditAddressData({
                  ...editAddressData,
                  zone_id: e.target.value,
                })
              }
            >
              <option value="">Select a zone</option>
              {zones?.map((zone) => (
                <option key={zone?.id} value={zone?.id}>
                  {zone?.zone_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="streetTypeInput">
            <Form.Label>Select a label for effective delivery:</Form.Label>
            <div className="d-flex justify-content-between gap-4">
              <Button
                variant=""
                style={{
                  flex: "1",
                  border: "1px solid #6d69694e",
                  backgroundColor:
                    editAddressData.address_type == 2 ? "#239bb5" : "",
                  color: editAddressData.address_type == 2 ? "#fff" : "",
                }}
                onClick={() =>
                  setEditAddressData({
                    ...editAddressData,
                    address_type: "2", // Home Address
                  })
                }
              >
                Home
              </Button>
              <Button
                variant=""
                style={{
                  flex: "1",
                  border: "1px solid #6d69694e",
                  backgroundColor:
                    editAddressData.address_type == 3 ? "#239bb5" : "",
                  color: editAddressData.address_type == 3 ? "#fff" : "",
                }}
                onClick={() =>
                  setEditAddressData({
                    ...editAddressData,
                    address_type: "3", // Office Address
                  })
                }
              >
                Office
              </Button>
            </div>
          </Form.Group>
          <div className="form-check">
            <input
              onChange={() => {
                setEditAddressData({
                  ...editAddressData,
                  is_default: editAddressData.is_default === 1 ? 0 : 1,
                });
              }}
              className="form-check-input"
              type="checkbox"
              value=""
              id="flexCheckChecked"
              checked={editAddressData.is_default === 1}
            />
            <label className="form-check-label" htmlFor="flexCheckChecked">
              Set as default address
            </label>
          </div>
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-4">
        <div>
          <Button
            className="btn bg-secondary border-0 px-4 py-2"
            onClick={() => setShow3(false)}
          >
            Cancel
          </Button>
        </div>
        <div className="btnDiv">
          <Button
            className="btn bg-purple border-0 px-4 py-2"
            onClick={handleUpdateAddress}
          >
            Update Address
          </Button>
        </div>
        {/* <Button
                    variant="secondary"
                    onClick={() => (setShow3(false))}
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleUpdateAddress}
                    style={{ backgroundColor: "#239bb5" }}
                >
                    Update Address
                </Button> */}
      </div>
    </div>
  );
};

export default UpdateAddress;
