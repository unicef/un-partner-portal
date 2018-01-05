
// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectExtendedApplicationStatuses } from '../../../store';

const withApplicationStatus = ComposedComponent => connect(
  (state, ownProps) => ({
    status: selectExtendedApplicationStatuses(state)[ownProps.appStatus],
  }),
)(ComposedComponent);


withApplicationStatus.propTypes = {
  status: PropTypes.string.isRequired,
};

export default withApplicationStatus;

