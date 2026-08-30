import Link from "next/link";

const Breadcrumb = ({ items }) => {
  return (
    <div className="breadcrumbContainer d-none d-lg-block">
      <nav aria-label="breadcrumb" className="container">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>
          {items?.map((item, index) => (
            <li key={index} className="breadcrumb-item">
              <Link href={item?.href}>{item?.label}</Link>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
