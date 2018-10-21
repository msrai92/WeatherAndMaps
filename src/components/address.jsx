import React, { Component } from "react";

class Address extends Component {
  state = {};
  render() {
    return (
      <form onSubmit={this.props.getAddress}>
        <input type="text" name="address" placeholder="address.." />
        
        <button>Location </button>
      </form>
    );
  }
}

export default Address;
