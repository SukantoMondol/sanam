import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const AllAddresses = ({
  setUpdateAddressId,
  allAddressesData,
  fetchAllAddressesData,
  showAllAddressesModal,
  handleCloseAllAddressesModal,
  handleShowAddAddressModal,
  handleShowUpdateAddressModal,
}) => {
  const [defaultAddressId, setDefaultAddressId] = useState(null);

  const deleteAllAddress = async () => {
    try {
      const response = await axiosInstance.delete(`/delete-all-addresses`);
      if (response?.data?.status) {
        toast.success(response?.data?.status_message);
        fetchAllAddressesData();
      } else {
        toast.error(response?.data?.status_message);
      }
    } catch (error) {
      throw new Error(error?.message);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const response = await axiosInstance.delete(`/address/${addressId}`);
      if (response?.data?.status) {
        fetchAllAddressesData();
        toast.success(response?.data?.status_message);
      } else {
        toast.error(response?.data?.status_message);
      }
    } catch (error) {
      throw new Error(error?.message);
    }
  };

  const handleDefaultAddress = async (id) => {
    setDefaultAddressId(id);

    try {
      const response = await axiosInstance.put(`/set-default-address/${id}`);
      if (response?.data?.status) {
        fetchAllAddressesData();
        toast.success(response?.data?.status_message);
      } else {
        toast.error(response?.data?.status_message);
      }
    } catch (error) {
      throw new Error(error?.message);
    }
  };

  return (
    <Modal
      show={showAllAddressesModal}
      onHide={handleCloseAllAddressesModal}
      id={"changeAddress"}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>All Addresses</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-end">
          <button
            className="clearAllAddressBtn mb-3"
            onClick={() => deleteAllAddress()}
          >
            Clear all Address
          </button>
        </div>
        <div className="allAddresses">
          {allAddressesData?.map((address) => (
            <div
              key={address?.id}
              className={`d-flex justify-content-between align-items-start ${
                defaultAddressId === address?.id && "border border-primary"
              }`}
              onClick={() => handleDefaultAddress(address?.id)}
            >
              <div key={address?.id} className="address">
                <p>{address?.name}</p>
                <p>{address?.phone}</p>
                <p>
                  {address?.street_address}, {address?.zone_name},
                  {address?.city_name}, {address?.division_name}
                </p>

                <div className="d-flex flex-wrap gap-2">
                  {address?.address_type_text && (
                    <p
                      className="text-nowrap"
                      style={{
                        backgroundColor: "#772d92",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        color: "white",
                        width: "fit-content ",
                      }}
                    >
                      {address?.address_type_text}
                    </p>
                  )}

                  {address?.is_default === 1 && (
                    <button className="defaultAddress text-nowrap">
                      {address?.is_default ? "Default Shipping Address" : ""}
                    </button>
                  )}
                </div>
              </div>

              <div className="d-flex gap-2 align-items-center actions">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteAddress(address?.id);
                  }}
                  className="border border-danger py-1 d-flex align-items-center"
                >
                  <MdDelete className="text-danger" size={22} />
                </button>

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    setUpdateAddressId(address?.id);
                    handleShowUpdateAddressModal();
                  }}
                  className="border-secondary-color py-1 d-flex align-items-center"
                >
                  <FaEdit size={22} className="text-secondary-color" />
                </button>
              </div>
            </div>
          ))}

          <button className="addAddressBtn" onClick={handleShowAddAddressModal}>
            Add Address
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AllAddresses;
