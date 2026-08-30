import Image from "next/image";

const FlashSale = () => {
  return (
    <div className={"container mt-4"}>
      <div className="row">
        <div className="col-lg-12">
          <div className="">
            <h2>Can’t-beat Black Friday Deals</h2>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-lg-3">
          <div className="flash-sale-card">
            <h3 className={"flash-sale-card-title"}>Mattress & More</h3>
            <p className={"flash-sale-discount-card-discount-text"}>
              <small>up to</small>
            </p>
            <h2 className={"flash-sale-card-discount-amount"}>
              80 <sup>%</sup>
              <sub>OFF</sub>
            </h2>
            <Image
              src={"/assets/images/products/bed.png" || "/placeholder.svg"}
              alt={"flash sale product"}
              width={280}
              height={280}
              className={"flash-sale-product"}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className="flash-sale-card">
            <h3 className={"flash-sale-card-title"}>Mattress & More</h3>
            <p className={"flash-sale-discount-card-discount-text"}>
              <small>up to</small>
            </p>
            <h2 className={"flash-sale-card-discount-amount"}>
              70 <sup>%</sup>
              <sub>OFF</sub>
            </h2>
            <Image
              src={"/assets/images/products/bed.png" || "/placeholder.svg"}
              alt={"flash sale product"}
              width={280}
              height={280}
              className={"flash-sale-product"}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className="flash-sale-card">
            <h3 className={"flash-sale-card-title"}>Mattress & More</h3>
            <p className={"flash-sale-discount-card-discount-text"}>
              <small>up to</small>
            </p>
            <h2 className={"flash-sale-card-discount-amount"}>
              60 <sup>%</sup>
              <sub>OFF</sub>
            </h2>
            <Image
              src={"/assets/images/products/bed.png" || "/placeholder.svg"}
              alt={"flash sale product"}
              width={280}
              height={280}
              className={"flash-sale-product"}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className="flash-sale-card">
            <h3 className={"flash-sale-card-title"}>Mattress & More</h3>
            <p className={"flash-sale-discount-card-discount-text"}>
              <small>up to</small>
            </p>
            <h2 className={"flash-sale-card-discount-amount"}>
              50 <sup>%</sup>
              <sub>OFF</sub>
            </h2>
            <Image
              src={"/assets/images/products/bed.png" || "/placeholder.svg"}
              alt={"flash sale product"}
              width={280}
              height={280}
              className={"flash-sale-product"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSale;
