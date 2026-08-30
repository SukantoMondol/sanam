import ImageComponent from "@/components/UI/Cards/ImageComponent";

const categories = [
  {
    id: "wood",
    name: "WOOD",
    image: "/assets/images/Categories/f-1.png",
  },
  {
    id: "upholstered",
    name: "UPHOLSTERED",
    image: "/assets/images/Categories/f-2.png",
  },
  {
    id: "leather",
    name: "LEATHER",
    image: "/assets/images/Categories/f-3.png",
  },
  {
    id: "woven",
    name: "WOVEN",
    image: "/assets/images/Categories/f-4.png",
  },
  {
    id: "metal",
    name: "METAL",
    image: "/assets/images/Categories/f-5.png",
  },
  {
    id: "slipcovered",
    name: "SLIPCOVERED",
    image: "/assets/images/Categories/f-6.png",
  },
];

const CategoryShowcase = () => {
  return (
    <section className="category-section container mb-80">
      <div className="container ">
        <h2 className="category-title mb-4 border-bottom pb-4 border-dark">
          Special for You
        </h2>
        {/* Responsive Grid System */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-4 pt-5">
          {categories.map((category, index) => (
            <div key={index} className="col scroll-snap-start">
              <div className="card border-0 rounded-4 overflow-hidden">
                <div className="position-relative category-showcase">
                  <ImageComponent
                    src={category.image || "/placeholder.svg"}
                    alt={`${category.name} Furniture Category`}
                    className="object-fit-cover category-image category-showcase-image"
                  />
                </div>
                <div className="category-label text-center mt-2">
                  {category.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
