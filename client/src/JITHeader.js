import React from "react";

const JITHeader = (props) => {
  const { subHeading } = props;
  return (
    <div class="jumbotron jumbotron-fluid bg-dark text-white">
      <div class="container">
        <h1 class="display-3">Just In Time Development</h1>
        <hr class="display-5" />
        <h4 class="text-right">{subHeading}</h4>
      </div>
    </div>
  );
};

export default JITHeader;
