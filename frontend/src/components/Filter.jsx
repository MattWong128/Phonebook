import React from "react";

const Filter = ({ searchQuery, onChange }) => {
  return (
    <div>
      Filter shown with
      <input type='text' value={searchQuery} onChange={onChange} />
    </div>
  );
};

export default Filter;
