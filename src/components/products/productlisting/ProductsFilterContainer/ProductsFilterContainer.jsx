"use client";
import ProductFilter from "@/components/Pages/Products/ProductFilter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Accordion } from "react-bootstrap";

const ProductsFilterContainer = ({ productsData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const attributes = {};
  for (let key in productsData?.filters?.attributes) {
    if (key === "Code Number") continue;
    attributes[key] = productsData?.filters?.attributes[key];
  }

  // Extract existing query parameters from the URL and convert them into an object
  const extractedParams = Object.fromEntries(
    new URLSearchParams(searchParams.toString()).entries()
  );

  const handleAttributeClick = (isChecked, attribute) => {
    // Convert the current attribute query string into an array, or initialize an empty array if null
    let updatedAttributes = extractedParams?.attribute?.split(",") ?? [];

    if (isChecked) {
      // Add the selected attribute if it doesn't already exist in the array
      if (!updatedAttributes.includes(attribute)) {
        updatedAttributes.push(attribute);
      }
    } else {
      // Remove the attribute from the array if it is unchecked
      updatedAttributes = updatedAttributes.filter(
        (item) => item !== attribute
      );
    }

    // Create a new URLSearchParams instance to construct the query string
    const queryParams = new URLSearchParams();
    const paramsToSet = {
      page: extractedParams?.page,
      max_price: extractedParams?.max_price,
      min_price: extractedParams?.min_price,
      per_page: extractedParams?.per_page,
      attribute:
        updatedAttributes.length > 0 ? updatedAttributes.join(",") : null,
    };

    // Loop through the object and set query params dynamically, avoiding null values
    Object.entries(paramsToSet).forEach(([key, value]) => {
      if (value) queryParams.set(key, value);
    });

    // Update the URL with the new query parameters while ensuring the correct format
    router.push(`${pathName}?${decodeURIComponent(queryParams.toString())}`);
    // router.push(`${pathName}?${queryParams}`);
  };

  return (
    <Accordion defaultActiveKey="0-accordion">
      {Object.keys(attributes)?.map((attributeKey, index) => (
        <div key={attributeKey} className="productFilter">
          <Accordion.Item eventKey={`${index}-accordion`}>
            <Accordion.Header as={"p"}>
              <p className="filter-title mb-0">{attributeKey}</p>
            </Accordion.Header>
            <Accordion.Body>
              <div className="filter-options">
                {productsData?.filters?.attributes[attributeKey]?.map(
                  (attribute, index) => (
                    <ProductFilter
                      key={index}
                      attribute={attribute}
                      handleAttributeClick={handleAttributeClick}
                    />
                  )
                )}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </div>
      ))}
    </Accordion>
  );
};

export default ProductsFilterContainer;
