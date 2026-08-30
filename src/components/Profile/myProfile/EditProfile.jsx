"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Button,
  Col,
  Row,
  ButtonGroup,
} from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "@/components/UI/Shared/Loader";
import Link from "next/link";
import ImageComponent from "@/components/UI/Cards/ImageComponent";
// import dynamic from "next/dynamic";
import axiosInstance from "@/utils/axiosInstance";
import { getCookie } from "cookies-next";

// const getCookie = dynamic(() => import("cookies-next"), {
//   ssr: false,
// });

const EditProfile = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({});
  const [updateProfile, setUpdateProfile] = useState({});
  const [type, setType] = useState("profile");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const [nidFrontFile, setNidFrontFile] = useState(null);
  const [nidFrontUrl, setNidFrontUrl] = useState(null);

  const [nidBackFile, setNidBackFile] = useState(null);
  const [nidBackUrl, setNidBackUrl] = useState(null);
  const [disable, setDisable] = useState(false);
  const [loader, setLoader] = useState(false);

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });
  const [passwordConfirmationError, setPasswordConfirmationError] =
    useState("");

  const ProfileData = async () => {
    setLoader(true);

    try {
      const GetData = await axiosInstance.get(`/profile-view`);
      setProfile(GetData?.data?.data);
      setUpdateProfile(GetData?.data?.data); // Initialize updateProfile with current profile data
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    ProfileData();
  }, []);

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateProfile((prevUpdateData) => ({
      ...prevUpdateData,
      [name]: value,
    }));
  };

  const handleDateOfBirthChange = (e) => {
    // Update date of birth state
    setDateOfBirth(e.target.value);

    // Update updateProfile state with the new date of birth
    setUpdateProfile((prevUpdateData) => ({
      ...prevUpdateData,
      date_of_birth: e.target.value,
    }));
  };

  const handleUpdatePhotoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      setPhotoFile(file);
      setPhotoUrl(base64String);
      setUpdateProfile((prevUpdateData) => ({
        ...prevUpdateData,
        photo: base64String, // Store the Base64 encoded photo in the updateProfile state
      }));
    };

    if (file) {
      reader.readAsDataURL(file); // Convert the selected file to Base64 format
    }
  };

  const handleUpdateNidFrontChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      setNidFrontFile(file);
      setNidFrontUrl(base64String);
      setUpdateProfile((prevUpdateData) => ({
        ...prevUpdateData,
        national_id_card_photo: base64String, // Store the Base64 encoded photo in the updateProfile state
      }));
    };

    if (file) {
      reader.readAsDataURL(file); // Convert the selected file to Base64 format
    }
  };

  const handleUpdateNidBackChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      setNidBackFile(file);
      setNidBackUrl(base64String);
      setUpdateProfile((prevUpdateData) => ({
        ...prevUpdateData,
        national_id_card_photo_back_side: base64String, // Store the Base64 encoded photo in the updateProfile state
      }));
    };

    if (file) {
      reader.readAsDataURL(file); // Convert the selected file to Base64 format
    }
  };

  const handleGenderChange = (e) => {
    const { name, value } = e.target;
    setUpdateProfile((prevUpdateData) => ({
      ...prevUpdateData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/profile-update`,
        updateProfile,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      router.push("/my-profile");
      setDisable(false);
      toast.success("Profile updated successfully!");
    } catch (error) {}
  };

  // ... chnage password  ...

  // Define the options for the gender dropdown
  const genderOptions = [
    { id: 1, label: "Male" },
    { id: 2, label: "Female" },
    { id: 3, label: "Others" },
  ];
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
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      if (response.data?.status_code === 460) {
        toast.error(response.data?.status_message);
      }
      if (response.data?.status_code === 200) {
        toast.success("Password updated successfully!");
        router.push("/my-profile");
      }
      setDisable(false);
    } catch (error) {}
  };

  useEffect(() => {
    if (getCookie("token")) {
      ProfileData();
    }
  }, [getCookie("token")]);

  useEffect(() => {
    setUpdateProfile((prevUpdateData) => ({
      ...prevUpdateData,
      gender: profile?.gender_id || "", // Set the gender value if available, otherwise set to an empty string
    }));

    setPhotoUrl(profile?.photo || null);
    setNidFrontUrl(profile?.national_id_card_photo || null);
    setNidBackUrl(profile?.national_id_card_photo_back_side || null);
  }, [profile]);

  if (loader) return <Loader />;

  return (
    <div
      className={`globalPadding my-4 editProfilePage`}
      // style={{ minHeight: "calc(100vh - 233px)" }}
    >
      <h1 className="d-none">Edit Profile</h1>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Row className="d-flex  justify-content-start justify-content-md-center">
            <Col md={7}>
              <Form.Group>
                <Form.Label className="fw-bold text-muted">Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={updateProfile?.name}
                  onChange={handleUpdateChange}
                />
              </Form.Group>
            </Col>
            <Col md={7} className="mt-4">
              <Form.Group>
                <Form.Label className="fw-bold text-muted">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={updateProfile?.email}
                  onChange={handleUpdateChange}
                />
              </Form.Group>
            </Col>
            <Col md={7} className="mt-4">
              <Form.Group>
                <Form.Label className="fw-bold text-muted">Phone</Form.Label>
                <Form.Control
                  id="disabledTextInput"
                  type="number"
                  name="phone"
                  value={updateProfile?.phone}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={7} className="mt-4">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold text-muted">
                  Your Photo
                </Form.Label>
                <Form.Control
                  type="file"
                  name="photo"
                  onChange={handleUpdatePhotoChange}
                />
              </Form.Group>
              {photoUrl && (
                <ImageComponent
                  className="rounded"
                  src={photoUrl}
                  alt="Uploaded"
                  height={100}
                  width={100}
                  // style={{ maxWidth: "100px", marginTop: "10px" }}
                />
              )}
            </Col>
            <Col md={7} className="mt-4">
              <Form.Group>
                <Form.Label className="fw-bold text-muted">
                  Date of Birth
                </Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={updateProfile?.dateOfBirth}
                  onChange={handleDateOfBirthChange} // Update the dateOfBirth state
                />
              </Form.Group>
            </Col>
            <Col md={7} className="mt-4">
              <Form.Group>
                <Form.Label className="fw-bold text-muted">Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  value={updateProfile.gender || ""} // Provide a default value of an empty string to handle the initial state
                  onChange={handleGenderChange}
                >
                  <option value="">Select Gender</option>
                  {genderOptions.map((option) => (
                    <option key={option?.id} value={option?.id}>
                      {option?.label}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={7}>
              <div className="d-flex justify-content-end gap-3 mt-4">
                <Link href="/my-profile">Back</Link>
                <button type="submit">Update Profile</button>
              </div>
            </Col>
          </Row>
          <Row className="d-flex  justify-content-start justify-content-md-center mt-3">
            {/* <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>NID(Front Side)</Form.Label>
                                <Form.Control
                                    name='nidFront'
                                    type="file"
                                    onChange={handleUpdateNidFrontChange}
                                />
                            </Form.Group>
                            {nidFrontUrl && <img src={nidFrontUrl} alt="NID Front" style={{ maxWidth: '100px', marginTop: '10px' }} />}
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>NID(Back Side)</Form.Label>
                                <Form.Control
                                    name='nidBack'
                                    type="file"
                                    onChange={handleUpdateNidBackChange}
                                />
                            </Form.Group>
                            {nidBackUrl && <img src={nidBackUrl} alt="NID Back" style={{ maxWidth: '100px', marginTop: '10px' }} />}
                        </Col> */}
          </Row>
          {/* <div className='d-flex  justify-content-start justify-content-md-center gap-3'>
                        <Button
                            type='submit'
                            className=" mt-4 "
                            disabled={disable}
                            style={{ backgroundColor: '#239bb5' }}>Update Profile</Button>

                        <Link href='/my-profile'>
                            <Button className='mt-4' variant="secondary">Back</Button>
                        </Link>

                    </div> */}

          {/* {type === 'password' && (
                        <Row className='mt-3'>
                            <Col md={4}>
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
                            <Col md={4}>
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
                                {passwordConfirmationError && (
                                    <div className="text-danger mb-3">{passwordConfirmationError}</div>
                                )}
                            </Col>
                            <Col md={4}>
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
                            <Col md={{ span: 4, offset: 4 }} className="text-center">
                                <Button
                                    onClick={handleUpdatePassword}
                                    className="btn-block mt-4"
                                    disabled={disable}
                                    style={{ backgroundColor: '#239bb5' }}
                                >
                                    Update Password
                                </Button>
                            </Col>
                        </Row>
                    )} */}
        </Form>
      </Container>
    </div>
  );
};

export default EditProfile;
