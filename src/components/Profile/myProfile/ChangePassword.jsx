"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [passwordConfirmationError, setPasswordConfirmationError] =
    useState("");
  const [disable, setDisable] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevPasswordData) => ({
      ...prevPasswordData,
      [name]: value,
    }));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setDisable(true);
    // Check if the new password and confirmation password match
    if (
      passwordData?.password?.length < 6 ||
      passwordData?.password_confirmation?.length < 6
    ) {
      setPasswordConfirmationError(
        "The password field must be at least 6 characters."
      );
      setDisable(false);
      return;
    }

    if (passwordData?.password !== passwordData?.password_confirmation) {
      setPasswordConfirmationError("Passwords don't match");
      setDisable(false);
      return;
    }

    // Reset the error message if the passwords match
    setPasswordConfirmationError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/change-password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      if (response.data?.status_code === 460) {
        toast.error(response.data?.status_message);
      }
      if (response.data?.status_code === 200) {
        toast.success("Password updated successfully!");
        setPasswordData({
          old_password: "",
          password: "",
          password_confirmation: "",
        });
      }
      setDisable(false);
    } catch (error) {
      toast.error(error?.response?.data?.status_message);
    }
  };

  return (
    <div className="changePasswordContainer">
      <div className="d-flex justify-content-between">
        <h5 className="fw-normal mb-3">Update Password</h5>
      </div>
      <hr className="mt-1" />
      <Form className="mt-4">
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                name="old_password"
                value={passwordData.old_password}
                onChange={handleChangePassword}
                placeholder="Enter Old Password"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={passwordData.password}
                onChange={handleChangePassword}
                placeholder="Enter New Password"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="my-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="password_confirmation"
                value={passwordData.password_confirmation}
                onChange={handleChangePassword}
                placeholder="Confirm Password"
              />
            </Form.Group>
          </Col>
        </Row>
        {passwordConfirmationError && (
          <p className="text-danger m-0 mt-2">{passwordConfirmationError}</p>
        )}
        <Row>
          <Col md={6} className="text-center">
            <button
              type="submit"
              onClick={handleUpdatePassword}
              disabled={disable}
            >
              Update Password
            </button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ChangePassword;
