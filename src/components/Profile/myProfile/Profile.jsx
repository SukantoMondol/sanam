import ImageComponent from "@/components/UI/Cards/ImageComponent";
import Link from "next/link";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Profile = ({ profile }) => {
  return (
    <Container className="p-3 rounded-2">
      <Row>
        <Col md={3}>
          <div className="text-center rounded-2">
            <ImageComponent
              src={profile?.photo}
              alt="Profile Photo"
              className="rounded-2"
              height={150}
              width={150}
            />
          </div>
        </Col>
        <Col
          md={9}
          className="d-flex justify-content-center justify-content-lg-start"
        >
          <div className="mt-4 mt-lg-0">
            <h2>{profile?.name}</h2>
            <ul className="list-unstyled">
              <li className="my-2">
                <strong>Phone:</strong>{" "}
                {profile?.phone ? profile?.phone : "N/A"}
              </li>
              <li className="mb-2">
                <strong>Email:</strong>{" "}
                {profile?.email ? profile?.email : "N/A"}
              </li>
              <li className="mb-2">
                <strong>Gender:</strong>{" "}
                {profile?.gender_text ? profile?.gender_text : "N/A"}
              </li>
              <li className="mb-2">
                <strong>Date of Birth:</strong>{" "}
                {profile?.date_of_birth ? profile?.date_of_birth : "N/A"}
              </li>
            </ul>
            <Link href="/edit-profile" className="btnDiv w-50">
              <button className="mb-2 editProfileButton">Edit Profile</button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
