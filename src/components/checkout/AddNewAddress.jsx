import axiosInstance from "@/utils/axiosInstance";
import Form from "@/components/shared/Form/Form";
import Input from "@/components/shared/Form/Input";
import SelectInput from "@/components/UI/SelectInput";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import useAddressData from "@/hooks/useAddressData";

const AddNewAddress = ({
  fetchAllAddressesData,
  addNewAddressModal,
  handleCloseAddNewAddressModal,
}) => {
  const { register, handleSubmit, reset } = useForm();
  const [errorMessage, setErrorMessage] = useState({});
  const [selectedAddressType, setSelectedAddressType] = useState(0);
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);

  const {
    divisionsArray,
    districtsArray,
    zonesArray,
    selectedDivision,
    setSelectedDivision,
    selectedDistrict,
    setSelectedDistrict,
    selectedZone,
    setSelectedZone,
  } = useAddressData();

  const handleAddressSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/address", {
        ...data,
        address_type: selectedAddressType,
        is_default: isDefaultAddress,
        zone_id: selectedZone.value,
        division_id: selectedDivision.value,
        city_id: selectedDistrict.value,
        zip_code: "",
      });
      if (response?.data?.status) {
        toast.success(response?.data?.status_message);
        fetchAllAddressesData();
        reset();
        setErrorMessage({});

        setSelectedDivision({
          label: "Division",
          value: "",
        });

        setSelectedDistrict({
          label: "District",
          value: "",
        });

        setSelectedZone({
          label: "Zone",
          value: "",
        });

        handleCloseAddNewAddressModal();
      } else {
        toast.error(response?.data?.status_message);
      }
    } catch (error) {
      if (error?.status === 422) {
        setErrorMessage(error?.response?.data?.errors);
      } else {
        throw new Error(error?.message);
      }
    }
  };

  return (
    <Modal
      show={addNewAddressModal}
      onHide={handleCloseAddNewAddressModal}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <h5>Add New Address</h5>
      </Modal.Header>
      <Modal.Body>
        <div className="addAndUpdateAddress">
          <Form onSubmit={handleSubmit(handleAddressSubmit)}>
            <div>
              <label htmlFor="name">
                Full Name <span className="text-danger">*</span>
              </label>

              <Input
                register={register("name")}
                id="name"
                placeholder="Full Name"
                errorMessage={errorMessage}
              />
            </div>

            <div>
              <label htmlFor="phone">
                Mobile Number <span className="text-danger">*</span>
              </label>

              <Input
                register={register("phone")}
                id="phone"
                placeholder="Mobile Number"
                errorMessage={errorMessage}
              />
            </div>

            <div>
              <label htmlFor="street_address">
                House Address <span className="text-danger">*</span>
              </label>

              <Input
                register={register("street_address")}
                id="street_address"
                placeholder="House Address"
                errorMessage={errorMessage}
              />
            </div>

            <SelectInput
              required
              array={divisionsArray?.map(({ id, name }) => ({
                value: id,
                label: name,
              }))}
              state={selectedDivision}
              setState={setSelectedDivision}
              label="Division"
              id="division_id"
              error={errorMessage}
            />

            <SelectInput
              required
              array={districtsArray?.map(({ id, city_name }) => ({
                value: id,
                label: city_name,
              }))}
              state={selectedDistrict}
              setState={setSelectedDistrict}
              label="District"
              id="city_id"
              error={errorMessage}
            />

            <SelectInput
              required
              array={zonesArray?.map(({ id, zone_name }) => ({
                value: id,
                label: zone_name,
              }))}
              state={selectedZone}
              setState={setSelectedZone}
              label="Zone"
              id="zone_id"
              error={errorMessage}
            />

            <div className="delivery">
              <p>
                Select a label for effective delivery:
                <span className="text-danger"> *</span>
              </p>

              <div>
                <button
                  type="button"
                  className={selectedAddressType === 2 ? "activeButton" : ""}
                  onClick={() => setSelectedAddressType(2)}
                >
                  Home
                </button>
                <button
                  type="button"
                  className={selectedAddressType === 3 ? "activeButton" : ""}
                  onClick={() => setSelectedAddressType(3)}
                >
                  Office
                </button>
              </div>
            </div>

            <div className="defaultAddressOption">
              <input
                type="checkbox"
                id="defaultAddressOption"
                checked={isDefaultAddress}
                onChange={(e) => setIsDefaultAddress(e.target.checked)}
              />

              <label htmlFor="defaultAddressOption">
                Set as default address
              </label>
            </div>

            <div />

            <div className="formActions">
              <button onClick={handleCloseAddNewAddressModal} type={"button"}>
                Cancel
              </button>

              <button type="submit">Save Address</button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddNewAddress;
