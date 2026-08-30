"use client";
import ImageComponent from "@/components/UI/Cards/ImageComponent";
import { StarRating } from "@/components/util/StarRating";
const products = [
  {
    id: 1,
    name: 'Jewel 24" Single Bathroom Vanity Set',
    image: "assets/images/products/4.png",
    price: 319.99,
    originalPrice: 756.0,
    rating: 5,
    reviews: 190,
    onSale: true,
  },
  {
    id: 2,
    name: 'Jewel 24" Single Bathroom Vanity Set',
    image: "assets/images/products/4.png",
    price: 319.99,
    originalPrice: 756.0,
    rating: 5,
    reviews: 225,
  },
  {
    id: 2,
    name: 'Jewel 24" Single Bathroom Vanity Set',
    image: "assets/images/products/4.png",
    price: 319.99,
    originalPrice: 756.0,
    rating: 5,
    reviews: 225,
  },
  {
    id: 2,
    name: 'Jewel 24" Single Bathroom Vanity Set',
    image: "assets/images/products/4.png",
    price: 319.99,
    originalPrice: 756.0,
    rating: 5,
    reviews: 225,
  },
  {
    id: 2,
    name: 'Jewel 24" Single Bathroom Vanity Set',
    image: "assets/images/products/4.png",
    price: 319.99,
    originalPrice: 756.0,
    rating: 5,
    reviews: 225,
  },
  {
    id: 2,
    name: 'Jewel 24" Single Bathroom Vanity Set',
    image: "assets/images/products/4.png",
    price: 319.99,
    originalPrice: 756.0,
    rating: 5,
    reviews: 225,
  },
  // Add more products with similar structure
];

export default function RelatedProduct({ title }) {
  return (
    <div className="container product-comparison mt-100 mb-100">
      <h2 className="comparison-title mb-4">{title}</h2>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-6 g-4">
        {products.map((product) => (
          <div key={product.id} className="col">
            <div className="card h-100 product-card">
              <div className="position-relative">
                {product.onSale && <span className="sale-badge">Sale</span>}
                <ImageComponent
                  src={product.image || "/placeholder.svg"}
                  className="card-img-top"
                  alt={product.name}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title product-name">{product.name}</h5>
                <div className="price-container">
                  <span className="current-price">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="original-price">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                </div>
                <StarRating rating={product.rating} reviews={product.reviews} />
                <button className="bg-white w-100 px-4 py-2 text-purple border-1 border-purple rounded-5">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
