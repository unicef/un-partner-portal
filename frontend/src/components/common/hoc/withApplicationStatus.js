
// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectNewApplicationStatuses } from '../../../store';

const withApplicationStatus = ComposedComponent => connect(
  (state, ownProps) => ({
    status: selectNewApplicationStatuses(state)[ownProps.appStatus],
  }),
)(ComposedComponent);


withApplicationStatus.propTypes = {
  status: PropTypes.string.isRequired,
};

export default withApplicationStatus;

