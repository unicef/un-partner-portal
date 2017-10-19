
// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


const withCountryName = ComposedComponent => connect(
  (state, ownProps) => ({
    countryName: state.countries[ownProps.code],
  }),
)(ComposedComponent);


withCountryName.propTypes = {
  countryName: PropTypes.string.isRequired,
};

export default withCountryName;
