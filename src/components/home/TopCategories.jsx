import ImageComponent from "../UI/Cards/ImageComponent";
import Link from "next/link";

export default function TopCategories({ top_categories }) {
  const visibleCategories = top_categories?.filter(
    (cat) => cat.is_shown_on_home_page !== false
  );

  if (!visibleCategories?.length) return null;

  return (
    <div className="container my-4 temu-top-categories">
      <h2 className="temu-section-title text-center mb-4">TOP CATEGORIES</h2>
      <div className="temu-categories-scroll">
        {visibleCategories.map((category, index) => (
          <Link
            key={`${category.name}-${index}`}
            href={`/category/${category.slug}`}
            className="temu-category-item"
          >
            <div className="temu-category-img-wrapper">
              <ImageComponent
                src={category.picture}
                alt={`${category.name} image`}
                width={100}
                height={100}
                priority={index < 6}
                className="temu-category-img"
              />
              {index < 3 && (
                <span className="temu-hot-badge">HOT</span>
              )}
            </div>
            <span className="temu-category-name">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
