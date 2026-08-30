import { useState } from "react";

const Accordion = ({ title, index }) => {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div className="accordion" id="configAccordion">
      <div className="accordion-item border-0">
        <h2 className="accordion-header">
          <button
            className={`accordion-button bg-white ${
              activeSection === title ? "" : "collapsed"
            }`}
            onClick={() => setActiveSection(title)}
          >
            {title}
          </button>
        </h2>

        <div
          className={`accordion-collapse collapse ${
            activeSection === title ? "show" : ""
          }`}
        >
          <div className="accordion-body configurator-options-body d-flex flex-wrap gap-3">
            {productVariationsAttribute?.value?.map((value, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedValues({
                    ...selectedValues,
                    [productVariationsAttribute.name]: value,
                  });
                }}
                className={` ${
                  selectedValues[productVariationsAttribute?.name] === value
                    ? "selected"
                    : ""
                }`}
              >
                {value}
              </button>
            ))}
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste dicta
            sequi quisquam temporibus corrupti, animi culpa porro nulla ex
            expedita dolore voluptates tempora neque explicabo quibusdam debitis
            eos magni perspiciatis?
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
