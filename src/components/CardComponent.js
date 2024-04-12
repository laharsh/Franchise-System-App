import React from 'react';
// import './Card.css';

const Card = ({ title, copy, button, onClick}) => {
  return (
    <div className="card">
      <div className="content">
        <h2 className="title">{title}</h2>
        <p className="copy">{copy}</p>
        <button onClick={onClick} className="btn">{button}</button>
      </div>
    </div>
  );
}

export default Card;
