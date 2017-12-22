// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectOrganizationTypes } from '../../../store';

const withOrganizationType = ComposedComponent => connect(
  (state, ownProps) => {
    return {
      type: selectOrganizationTypes(state)[ownProps.orgType],
    };
  },
)(ComposedComponent);


withOrganizationType.propTypes = {
  type: PropTypes.string.isRequired,
};

export default withOrganizationType;

