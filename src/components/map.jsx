import { Map, Polyline, Marker, GoogleApiWrapper } from "google-maps-react";
import React, { Component } from "react";

export class MapContainer extends Component {
  state = {
    routes: [],
    destMark: [],
    duration: undefined,
    distance: undefined
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.endLocation !== nextProps.endLocation) {
      this.getLine(nextProps.startLocation, nextProps.endLocation);
    }
  }

  async getLine(startLocation, endLocation) {
    console.log("finding path");
    console.log(startLocation);
    console.log(endLocation);
    var proxyUrl = "https://cors-anywhere.herokuapp.com/";
    var targetUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation}&destination=${endLocation}`;
    var googleKey = "&key=AIzaSyDyjGCwJpw65Yhw9Y1N7YR4kUTKk_MZUsA";
    var polyCall = await fetch(`${proxyUrl}${targetUrl}${googleKey}`);
    console.log("fetch occurred");
    const polyInfo = await polyCall.json();
    console.log(polyInfo);
    var polyline = require("polyline");
    let paths = polyline.decode(polyInfo.routes[0].overview_polyline.points);
    console.log(paths);
    var route = [];
    for (var key in paths) {
      route.push({ lat: paths[key][0], lng: paths[key][1] });
    }
    var finalIndex = paths.length - 1;
    var dest = {
      lat: paths[finalIndex][0],
      lng: paths[finalIndex][1]
    };
    var dis = polyInfo.routes[0].legs[0].distance.text;
    var dur = polyInfo.routes[0].legs[0].duration.text;
    console.log(route);
    this.setState({
      routes: route,
      destMark: dest,
      duration: dur,
      distance: dis
    });
  }

  getPolyComponent(props) {
    return (
      <Polyline
        paths={this.state.route}
        strokeColor="#0000FF"
        strokeOpacity={0.8}
        strokeWeight={2}
      />
    );
  }

  render() {
    const style = {
      width: "80vh",
      height: "70vh",
      marginLeft: "auto",
      marginRight: "auto"
    };
    return (
      <div style={{ flex: 1, flexDirection: "column" }}>
        <div className="map_key" style={{ textAlign: 'center', color: 'black', fontSize: 20}}>
          {" "}
          <p className="map_key"> Distance:  <span className="map_value">
                {" "}
                {this.state.distance}
              </span></p>
          <p className="map_key"> Duration: <span className="map_value">
                {" "}
                {this.state.duration}
              </span></p>
        </div>
        <div className="map_container">
          <Map
            google={this.props.google}
            center={{ lat: this.props.lat, lng: this.props.lng }}
            style={style}
            zoom={14}
          >
            {this.state.routes && (
              <Polyline
                path={this.state.routes}
                strokeColor="#0000FF"
                strokeOpacity={0.8}
                strokeWeight={2}
              />
            )}
            {this.props.lat && (
              <Marker position={{ lat: this.props.lat, lng: this.props.lng }} />
            )}
            {this.state.destMark && <Marker position={this.state.destMark} />}
          </Map>
        </div>
        <Marker onClick={this.onMarkerClick} name={"Current Location"} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDcb_mE6wl5lKjGqbmgf3ar_1Hp_rtEs8w"
})(MapContainer);
