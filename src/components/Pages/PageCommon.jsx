const PageCommon = ({ data }) => {
  return (
    <div className={"container mb-5"}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className={"text-center my-4"}>{data?.title}</h1>
          <div
            className={"common-rich-editor-content"}
            dangerouslySetInnerHTML={{ __html: data?.description }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PageCommon;
