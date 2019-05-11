import React from 'react';
import { Link } from 'react-router-dom';

const Cars = ({ car }) => (
  <Link to={{
    pathname: `/vehicles/${car.vehicleCapDetails.capMakeName}/${car.vehicleCapDetails.capRangeName}/${car.id}`,
    state: {
      car: car
    }
  }}>
    <li className="result-item">
      <div className="result-item__img">
        <img src={`https:${car.displayImage.medium}`} alt={car.vehicleCapDetails.capModelName} />
        <div className="result-item__img-overlay">
          <div className="result-item__img-overlay-text">View</div>
        </div>
      </div>
      <div className="result-item__body">
        <h4>{car.vehicleCapDetails.capMakeName} {car.vehicleCapDetails.capRangeName}</h4>
        <h5>{car.vehicleCapDetails.capDerivativeName}, {car.year}</h5>
        <p>{car.attentionGrabber}</p>
        <h3><span>From</span> £{car.minimumMonthlyPayment} <span>monthly or</span> £{car.vehiclePrice.salePrice}</h3>
        <p>+ £149 Admin Fee</p>
        <ul className="result-item__info">
          <li>{car.mileage} miles</li>
          <li>{car.fuel}</li>
          <li>{car.transmission}</li>
          <li>{car.displayColour}</li>
          <li>{car.storeName}</li>
        </ul>
      </div>
    </li>
  </Link>
)

export default Cars;