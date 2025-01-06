import React from 'react';
import './card.css';

function Card({ title, value, image, buttonText }) {
    return (
        <div className="card">
            {title && <h4>{title}</h4>}
            {value && <p>{value}</p>}
            {image && <img src={`./assets/images/${image}`} alt="Car" />}
            {buttonText && <button>{buttonText}</button>}
        </div>
    );
}

export default Card;
