
// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isUserAgencyReader } from '../../../helpers/authHelpers';


const DisabledForAgencyEditor = (props) => {
  if (props.displayComponent) return props.children;
  return null;
};


DisabledForAgencyEditor.propTypes = {
  countryName: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  displayComponent: !isUserAgencyReader(state),
});


export default connect(mapStateToProps)(DisabledForAgencyEditor);
