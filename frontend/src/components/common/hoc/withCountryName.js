
// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


const withCountryName = ComposedComponent => connect(
  state => ({
    countries: state.countries,
  }),
  null,
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...{
      countryName: stateProps.countries[ownProps.code],
    },
  }),
)(ComposedComponent);


withCountryName.propTypes = {
  countryName: PropTypes.string.isRequired,
};

export default withCountryName;
