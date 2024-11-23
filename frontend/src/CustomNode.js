import React from 'react';

const CustomNode = ({ data }) => {
  return (
    <div>
      <span>{data.label}</span>
      <button onClick={() => alert('Node action')}>Action</button>
    </div>
  );
};

export default CustomNode;
