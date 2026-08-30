function BenefitCard({ title, subtitle, description }) {
  return (
    <div className="col">
      <div className="card h-100 border-0 text-center bg-light-purple">
        <div className="card-body">
          {/* <Image
            src={"/assets/images/banner/hex-background.png"}
            alt={"Bottom Banner"}
            width={110}
            height={76}
            className="object-fit-cover rounded-3"
          /> */}

          <div className=" mb-2 d-flex align-items-center justify-content-center">
            <div className="hexagon">
              <p className="display-6 text-dark-purple fw-bold font-28">
                {title}
              </p>
            </div>
          </div>
          <div className="px-4 pt-2">
            <p className="card-title mb-2 font-poppins fs-5 fw-bold">
              {subtitle}
            </p>
            <p className="card-text fs-6 fw-normal">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RewardsGrid() {
  // const benefits = [
  //   {
  //     title: "15% back in rewards",
  //     description: "on every item every day. Bonus: They never expire!",
  //   },
  //   {
  //     title: "Free shipping on every order",
  //     description: "From plates to sofas-it's on us",
  //   },
  //   {
  //     title: "Special offers & perks",
  //     description: "We'll treat you on your birthday - and just because.",
  //   },
  //   {
  //     title: "member support line",
  //     description: "call for fast, quality assistance",
  //   },
  //   {
  //     title: "save across our family of brands",
  //     description:
  //       "enjoy member benefits on All modern, Birch Lane, and joss & Main.",
  //   },
  // ];

  const rewards = [
    {
      title: "Delivery",
      subtitle: "Fast Delivery",
      description: "Delivery inside Kuwait within 3-4 hours.",
    },
    {
      title: "Payment",
      subtitle: "Cash On Delivery",
      description: "Pay with Cash or KNET upon arrival at your doorstep.",
    },
    {
      title: "Quality",
      subtitle: "100% Genuine",
      description: "Top quality and authentic products guaranteed.",
    },
    {
      title: "Support",
      subtitle: "Customer Service",
      description: "Available on WhatsApp & Phone to help you anytime.",
    },
    {
      title: "Warranty",
      subtitle: "Easy Returns",
      description: "Hassle-free replacement and reliable product guarantee.",
    },
  ];

  return (
    <div className="container position-relative my-5">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-5 g-3">
        {rewards.map((reward) => (
          <BenefitCard
            key={reward?.title}
            title={reward?.title}
            subtitle={reward?.subtitle}
            description={reward?.description}
          />
        ))}
      </div>
    </div>
  );
}
