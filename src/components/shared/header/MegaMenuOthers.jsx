import Link from "next/link";

function splitIntoColumns(children, numCols) {
  const columns = Array.from({ length: numCols }, () => []);
  const totalHeight = children.reduce(
    (sum, c) => sum + 1 + (c.children?.length || 0),
    0
  );
  const targetHeight = Math.ceil(totalHeight / numCols);
  let colIdx = 0;
  let colHeight = 0;
  for (const child of children) {
    const childHeight = 1 + (child.children?.length || 0);
    if (colHeight > 0 && colHeight + childHeight > targetHeight && colIdx < numCols - 1) {
      colIdx++;
      colHeight = 0;
    }
    columns[colIdx].push(child);
    colHeight += childHeight;
  }
  return columns;
}

const MegaMenuOthers = ({ category }) => {
  if (!category?.length) return null;

  const columns = splitIntoColumns(category, 4);

  return (
    <div className="megaMenuContainer w-100">
      <div className="container mega-menu-inner">
        <div className="mega-menu-grid">
          {columns.map((col, colIndex) => (
            <div className="mega-menu-col-wrapper" key={colIndex}>
              {col.map((child) => (
                <div className="mega-menu-column" key={child?.id}>
                  <Link
                    className="mega-menu-group-title"
                    href={`/category/${child?.slug}`}
                  >
                    {child?.name}
                  </Link>
                  {child?.children?.length > 0 && (
                    <ul className="mega-menu-subitems list-unstyled mt-2 mb-0">
                      {child.children.map((subChild) => (
                        <li key={subChild?.id}>
                          <Link
                            className="mega-menu-sub-link"
                            href={`/category/${subChild?.slug}`}
                          >
                            {subChild?.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenuOthers;
