import { X } from "lucide-react";
import React, { forwardRef } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// eslint-disable-next-line react/display-name
const Modal = forwardRef(
  (
    {
      modalTitle,
      modalContent,
      size = "modal-fullscreen",
      modalFooter = false,
      submitHandler,
      id = "exampleModal",
    },
    ref
  ) => {
    return (
      <div
        className={`modal fade modal_container`}
        id={id}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref={ref} // Attach the ref here
      >
        <div className={`modal-dialog ${size}`}>
          <div className="modal-content">
            {/* Header section of the modal */}
            <div className="modal-header">
              <h1 className="modal-title fs-5" id={id}>
                {modalTitle}
              </h1>

              <X
                className="close_icon"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            {/* Body section of the modal */}
            <div className="modal-body">{modalContent}</div>

            {/* Conditional rendering of the footer */}
            {modalFooter && (
              <div className="modal-footer">
                <button className="cancel_button" data-bs-dismiss="modal">
                  Cancel
                </button>

                <button
                  onClick={submitHandler}
                  className="delete_button"
                  data-bs-dismiss="modal"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default Modal;
