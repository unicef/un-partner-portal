
// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeAppStatus } from '../../../reducers/partnersApplicationsList';

const WithApplicationStatusChange = status => ComposedComponent => connect(
  null,
  dispatch => ({ changeStatus: id => dispatch(changeAppStatus(id, status)) }),
)(ComposedComponent);


WithApplicationStatusChange.propTypes = {
  changeStatus: PropTypes.string.isRequired,
};

export default WithApplicationStatusChange;
