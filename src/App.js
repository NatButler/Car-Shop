import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import './App.css';
import Cars from './cars';
import Car from './car';
import Option from './option';

class App extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      keywordSearch: '',
      colourFilters: '',
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

  clearAllFilters() {
    this.setState({
      colourFilters: '',
      bodyFilters: '',
      fuelFilters: ''
    });
  }

  render() {
    let items = [],
        colours = [],
        bodyTypes = [],
        fuelTypes = [];

    let colourTally = {},
        bodyTypesTally = {},
        fuelTypesTally = {};

    if (this.state.keywordSearch) {
      items = this.state.items.filter(
        item => item.vehicleCapDetails.capMakeName.includes(this.state.keywordSearch) || item.vehicleCapDetails.capModelName.includes(this.state.keywordSearch)
      );
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

    // Filter tallyss reducer
    const tallyReducer = (tally, item) => {
      if (!tally[item]) {
        tally[item] = 1;
      } else {
        tally[item] = tally[item] + 1;
      }
      return tally;
    }

    // Create filter lists
    if (this.state.items.length) {
      colours = [...new Set( this.state.items.map(item => item.displayColour) )].sort();
      bodyTypes = [...new Set( this.state.items.map(item => item.vehicleCapDetails.bodyStyle) )].sort();
      fuelTypes = [...new Set( this.state.items.map(item => item.fuel) )].sort();
    }

    // Create filter tallys
    if (items.length) {
      colourTally = items.map(item => item.displayColour).reduce(tallyReducer, {});
      bodyTypesTally = items.map(item => item.vehicleCapDetails.bodyStyle).reduce(tallyReducer, {});
      fuelTypesTally = items.map(item => item.fuel).reduce(tallyReducer, {});
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
                this.clearAllFilters();
              }}>
              Clear all
            </a>
            <fieldset disabled={items.length ? false : true}>
              <legend>Colour</legend>
              {colours.map(colour => <Option key={colour} option={colour} filter={this.colourFilter.bind(this)} clearFilter={this.clearColourFilter.bind(this)} count={colourTally} />)}
            </fieldset>
            <fieldset disabled={items.length ? false : true}>
              <legend>Body Type</legend>
              {bodyTypes.map(type => <Option key={type} option={type} filter={this.bodyFilter.bind(this)} clearFilter={this.clearBodyFilter.bind(this)} count={bodyTypesTally} />)}
            </fieldset>
            <fieldset disabled={items.length ? false : true}>
              <legend>Fuel Type</legend>
              {fuelTypes.map(type => <Option key={type} option={type} filter={this.fuelFilter.bind(this)} clearFilter={this.clearFuelFilter.bind(this)} count={fuelTypesTally} />)}
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


export default App;