"use client";

import { Col, Container, Row } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "@/components/UI/Shared/Loader";
import OrderList from "../orderList/OrderList";
import Profile from "./Profile";
import AddressBook from "../Address/AddressBook";
import ChangePassword from "./ChangePassword";
import { getCookie } from "cookies-next";
import axiosInstance from "@/utils/axiosInstance";

const MyProfile = () => {
  const [profile, setProfile] = useState({});
  const [loader, setLoader] = useState(false);
  const [listiteam, setlistiteam] = useState("Profile");

  const ProfileData = async () => {
    setLoader(true);
    try {
      const GetData = await axiosInstance.get(`/profile-view`);
      setProfile(GetData?.data?.data);
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    ProfileData();
  }, []);

  if (loader) return <Loader />;

  return (
    <div className={`globalPadding myProfilePage`}>
      <Container className="">
        <Row className="justify-content-center gap-lg-0 gap-3">
          <Col lg={3} className="mt-4">
            <div className="shadow-sm rounded">
              <div className="list-group ">
                <button
                  className={`list-group-item list-group-item-action btn px-3 ${
                    listiteam === "Profile" && "active"
                  }`}
                  onClick={() => setlistiteam("Profile")}
                  style={{
                    backgroundColor: listiteam === "Profile" && "#239bb5",
                    border: listiteam === "Profile" && "none",
                  }}
                >
                  Profile
                </button>
                <button
                  className={`btn list-group-item list-group-item-action px-3 ${
                    listiteam === "My Orders" && "active"
                  }`}
                  onClick={() => setlistiteam("My Orders")}
                  style={{
                    backgroundColor: listiteam === "My Orders" && "#239bb5",
                    border: listiteam === "My Orders" && "none",
                  }}
                >
                  My Orders
                </button>
                <button
                  className={`btn list-group-item list-group-item-action px-3 ${
                    listiteam === "Address Book" && "active"
                  }`}
                  onClick={() => setlistiteam("Address Book")}
                  style={{
                    backgroundColor: listiteam === "Address Book" && "#239bb5",
                    border: listiteam === "Address Book" && "none",
                  }}
                >
                  Address Book
                </button>
                <button
                  className={`btn list-group-item list-group-item-action px-3 ${
                    listiteam === "Change Password" && "active"
                  }`}
                  onClick={() => setlistiteam("Change Password")}
                  style={{
                    backgroundColor:
                      listiteam === "Change Password" && "#239bb5",
                    border: listiteam === "Change Password" && "none",
                  }}
                >
                  Change Password
                </button>
              </div>
            </div>
          </Col>

          <Col lg={9} className="mt-4">
            <div className="shadow-sm profileHeight rounded">
              <div className="">
                {listiteam === "Profile" && <Profile profile={profile} />}
                {listiteam === "My Orders" && <OrderList />}
                {listiteam === "Address Book" && <AddressBook />}
                {listiteam === "Change Password" && <ChangePassword />}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MyProfile;
