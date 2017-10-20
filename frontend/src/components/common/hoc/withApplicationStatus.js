
// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectApplicationStatuses } from '../../../store';

const withApplicationStatus = ComposedComponent => connect(
  (state, ownProps) => ({
    status: selectApplicationStatuses(state)[ownProps.appStatus],
  }),
)(ComposedComponent);


withApplicationStatus.propTypes = {
  status: PropTypes.string.isRequired,
};

export default withApplicationStatus;

