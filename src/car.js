import React from 'react';

const Car = props => {
  const car = props.location.state.car;

  return (
    <div className="car-display">
      <h1>{car.vehicleCapDetails.capMakeName} {car.vehicleCapDetails.capRangeName}</h1>
      <ul className="car-display__info">
        <li><span>{car.vehicleCapDetails.capDerivativeName}</span></li>
        <li><span>{car.year}</span></li>
        <li><span>{car.mileage} miles</span></li>
        <li><span>{car.fuel}</span></li>
      </ul>
      <ul className="car-display__price">
        <li><span>£{car.vehiclePrice.salePrice}</span></li>
        <li>or from <span>£{car.minimumMonthlyPayment}</span> monthly</li>
      </ul>
      <img src={`https:${car.displayImage.medium}`} alt={car.vehicleCapDetails.capModelName} />
      <h4 className="car-display__attention">{car.attentionGrabber}</h4>
      <p className="car-display__description">{car.autotraderDescription}</p>
      <h3>Top features</h3>
    </div>
  )
}

export default Car;