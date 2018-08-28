import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      keywordSearch: '',
      colourFilters: '',
      colourFilters2: ['Black', 'Blue', 'Grey'],
      bodyFilters: '',
      fuelFilters: ''
    }
  }

  componentDidMount() {
    fetch('http://localhost:3000/vehicles')
      .then(resp => resp.json())
      .then(resp => this.setState({items: resp}));
  }

  search(e) {
    this.setState({keywordSearch: e.target.value.trim().toUpperCase()});
  }

  colourFilter(e) {
    this.setState({colourFilters: e.target.value});
  }

  clearColourFilter() {
    this.setState({colourFilters: ''});
  }

  bodyFilter(e) {
    this.setState({bodyFilters: e.target.value});
  }

  clearBodyFilter() {
    this.setState({bodyFilters: ''});
  }

  fuelFilter(e) {
    this.setState({fuelFilters: e.target.value});
  }

  clearFuelFilter() {
    this.setState({fuelFilters: ''});
  }

  addColour(colour) {

    // this.setState({colourFilters2: })
  }

  render() {
    let items = [];
    let colours = [];
    let bodyTypes = [];
    let fuelTypes = [];

    let colourCount = {};
    let bodyTypesCount = {};
    let fuelTypesCount = {};

    if (this.state.keywordSearch) {
      items = this.state.items.filter(
        item => item.vehicleCapDetails.capMakeName.includes(this.state.keywordSearch) || item.vehicleCapDetails.capModelName.includes(this.state.keywordSearch)
      );
    }

    // Experimenting with using array of colour filters
    if (this.state.colourFilters) {
      let newItems = this.state.colourFilters2.map(colour => {
        return items.filter(item => item.displayColour === colour);
      });
      // Flatten array
      newItems = newItems.reduce((acc, val) => acc.concat(val), []);
      console.log(newItems);
    }

    if (this.state.colourFilters) {
      items = items.filter(
        item => item.displayColour === this.state.colourFilters
      );
    }

    if (this.state.bodyFilters) {
      items = items.filter(
        item => item.vehicleCapDetails.bodyStyle === this.state.bodyFilters
      );
    }

    if (this.state.fuelFilters) {
      items = items.filter(
        item => item.fuel === this.state.fuelFilters
      );
    }

    // Filter counts reducer
    const countReducer = (tally, item) => {
      if (!tally[item]) {
        tally[item] = 1;
      } else {
        tally[item] = tally[item] + 1;
      }
      return tally;
    }

    // Create filter lists
    if (this.state.items.length) {
      colours = this.state.items.map(item => item.displayColour);
      colours = [...new Set(colours)].sort();
      bodyTypes = this.state.items.map(item => item.vehicleCapDetails.bodyStyle);
      bodyTypes = [...new Set(bodyTypes)].sort();
      fuelTypes = this.state.items.map(item => item.fuel);
      fuelTypes = [...new Set(fuelTypes)].sort();
    }

    // Create filter counts
    if (items.length) {
      colourCount = items.map(item => item.displayColour).reduce(countReducer, {});
      bodyTypesCount = items.map(item => item.vehicleCapDetails.bodyStyle).reduce(countReducer, {});
      fuelTypesCount = items.map(item => item.fuel).reduce(countReducer, {});
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src="/carshop-logo-landscape.svg" alt="logo" />
          <input type="search" onChange={this.search.bind(this)} placeholder="Search by make or model" />
        </header>

        <aside className="filters">
          <h3>Refine results ({items.length})</h3>
          <form>
            <a 
              href="#" 
              onClick={e => { 
                e.preventDefault();
                // Clear filters in state
                // Clear checked checkboxes
              }}>
              Clear all
            </a>
            <fieldset disabled={items.length ? false : true}>
              <legend>Colour</legend>
              {colours.map(colour => <Option key={colour} option={colour} filter={this.colourFilter.bind(this)} clearFilter={this.clearColourFilter.bind(this)} count={colourCount} />)}
            </fieldset>
            <fieldset disabled={items.length ? false : true}>
              <legend>Body Type</legend>
              {bodyTypes.map(type => <Option key={type} option={type} filter={this.bodyFilter.bind(this)} clearFilter={this.clearBodyFilter.bind(this)} count={bodyTypesCount} />)}
            </fieldset>
            <fieldset disabled={items.length ? false : true}>
              <legend>Fuel Type</legend>
              {fuelTypes.map(type => <Option key={type} option={type} filter={this.fuelFilter.bind(this)} clearFilter={this.clearFuelFilter.bind(this)} count={fuelTypesCount} />)}
            </fieldset>
          </form>
        </aside>

        <main>
          <Route path="/vehicles/:make/:model/:id" render={props => <Car {...props} />} />
          <select className="sort-select">
            <option value="">Sort by price: Low-High</option>
            <option value="">Sort by price: High-Low</option>
          </select>
          <ul>
            {items.map(item => <Cars key={item.id} car={item} />)}
          </ul>
        </main>
      </div>
    );
  }
}

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

const Option = props => (
  <label className={!props.count[props.option] ? "option-select disabled" : "option-select"} htmlFor={props.option}>{props.option} <span>({props.count[props.option] || '0'})</span>
    <input 
      type="checkbox" 
      id={props.option} 
      name={props.option} 
      value={props.option}
      disabled={props.count[props.option] ? false : true}
      onChange={e => {
        if (e.target.checked) {
          // Add value to array
          props.filter(e);
        } else {
          // Remove value from array
          props.clearFilter();
        }
      }} />
  </label>
)


export default App;