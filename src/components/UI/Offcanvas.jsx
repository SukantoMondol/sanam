import { FaXmark } from "react-icons/fa6";

const Offcanvas = ({ children, isOpen, onClose, title = null }) => {
  return (
    <div className={`offcanvasContainer ${isOpen ? "open" : ""}`}>
      <div className="offcanvasOverlay" onClick={onClose} />

      <div className="offcanvasContent">
        <div className="offcanvasHeader d-flex flex-wrap align-items-center justify-content-between gap-2">
          <p className="offcanvasTitle fw-medium">{title}</p>

          <button onClick={onClose}>
            <FaXmark className="icon" />
          </button>
        </div>

        <div className="offcanvasBody">{children}</div>
      </div>
    </div>
  );
};

export default Offcanvas;
