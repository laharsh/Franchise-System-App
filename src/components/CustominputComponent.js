import React from 'react';

const TableCountInput = ({ value, min, max, onChange }) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div>
      <span className=" button-like " onClick={handleDecrement}disabled={value <= min}>-</span>
      <span className="margin">{value}</span>
      <span className=" button-like "  onClick={handleIncrement} disabled={value >= max}>+</span>
    </div>
  );
};

export default TableCountInput;
