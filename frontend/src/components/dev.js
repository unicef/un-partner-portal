/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


class Dev extends Component {
  render() {
    return (
      <div>
        <ArrayForm
          limit={15}
          fieldName="countries"
          outerField={Sector}
          innerField={Area}
        />
      </div>

    );
  }
}



export default Dev;

