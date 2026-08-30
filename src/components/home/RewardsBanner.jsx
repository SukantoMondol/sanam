import ImageComponent from "../UI/Cards/ImageComponent";

export default function RewardsBanner({ data }) {
  return (
    <div className="hero-banner container mt-100">
      {data.category_banner && (
        <ImageComponent
          src={data.category_banner}
          alt={data.name}
          width={1600}
          height={450}
          className="object-fit-cover rounded-3 img-fluid"
        />
      )}
      <div className="hero-content">
        <h1>{data.name}</h1>
        {/* <button className="hero-button">Shop Now</button> */}
      </div>
    </div>
  );
}
