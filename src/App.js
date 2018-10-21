import React, { Component } from "react";
import Weather from "./components/weather";
import MapContainer from "./components/map";
import Header from "./components/header";
import ResizeAware from "react-resize-aware";
import Address from "./components/address";
import Destination from "./components/destAddress";
const API_KEY = "60608bd5a81f2bb18430164f15d1c6ee";
const GOOGLE_API_KEY = "AIzaSyDcb_mE6wl5lKjGqbmgf3ar_1Hp_rtEs8w";

class App extends Component {
  state = {
    temperature: undefined,
    city: undefined,
    country: undefined,
    wind: undefined,
    humidity: undefined,
    description: undefined,
    error: undefined,
    center: undefined,
    zoom: undefined,
    lat: 37.774929,
    lng: -122.419416,
    startLocation: undefined,
    endLocation: undefined,
    route: false,
    points: undefined
  };

  getDest = async c => {
    c.preventDefault();
    console.log("destination btn pressed");
    const destination = c.target.elements.destination.value;
    console.log(destination);
    this.setState({
      endLocation: destination
    });
  };
  getAddress = async e => {
    e.preventDefault();
    console.log("address button pressed");
    console.log(e.target.elements.address.value);
    const address = e.target.elements.address.value;
    //const coord = getLocation(c.target.elements.address.value);
    //console.log(coord.results[0].geometry.location.lat);
    const googleapiCall = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_API_KEY}`
    );
    const data = await googleapiCall.json();
    let lattitude;
    let longitude;
    if (data.results[0]) {
      console.log(data);
      console.log(data.results[0].geometry.location.lat);
      console.log(data.results[0].geometry.location.lng);
      lattitude = data.results[0].geometry.location.lat;
      longitude = data.results[0].geometry.location.lng;
    }

    const apiCall = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lattitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`
    );
    const info = await apiCall.json();

    //if we get a city and country then we set state
    if (address && info) {
      console.log(info);
      this.setState({
        temperature: info.main.temp,
        city: data.results[0].formatted_address,
        country: info.sys.country,
        wind: info.wind.speed,
        humidity: info.main.humidity,
        description: info.weather[0].description,
        lat: lattitude,
        lng: longitude,
        startLocation: address,
        error: ""
      });
    } else {
      this.setState({
        temperature: undefined,
        city: undefined,
        country: undefined,
        wind: undefined,
        humidity: undefined,
        description: undefined,
        lat: 37.774929,
        lng: -122.419416,
        error: "Please make sure you entered a city and country"
      });
    }
  };

  render() {
    return (
      <div style={{ flex: 1, flexDirection: "column" }} className="wrapper">
        <div className="col-xs-7 header">
          <Header/>
        </div>
        <div className="col-xs-7 form-container">
        
          <div className="form-container3">
            <Address getAddress={this.getAddress} />
            <Destination getDest={this.getDest} />
          </div>
          <div className="form-container2">
            <Weather
              temperature={this.state.temperature}
              city={this.state.city}
              country={this.state.country}
              wind={this.state.wind}
              humidity={this.state.humidity}
              description={this.state.description}
              error={this.state.error}
            />
          </div>
          <div className="form-container4">
            <MapContainer
              lat={this.state.lat}
              lng={this.state.lng}
              startLocation={this.state.startLocation}
              endLocation={this.state.endLocation}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
