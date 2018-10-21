import React, { Component } from "react";

class Destination extends Component {
  state = {};
  render() {
    return (
      <form onSubmit={this.props.getDest}>
        <input type="text" name="destination" placeholder="destination.." />
        <button>Destination</button>
      </form>
    );
  }
}

export default Destination;
