import topPicks from "@/data/topPicks.json";

const TopPicks = () => {
  return (
    <div className="container mb-80">
      <div className="row">
        <h3 className="border-bottom border-1 border-dark pb-4">
          Top Picks For You
        </h3>
        <div className="row g-4 p-4">
          {/* <Product products={topPicks} column={4} /> */}
        </div>
      </div>
    </div>
  );
};

export default TopPicks;
