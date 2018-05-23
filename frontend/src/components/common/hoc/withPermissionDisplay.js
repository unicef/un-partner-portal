
// eslint-disable-next-line
import React from 'react';
import R from 'ramda';
import { connect } from 'react-redux';

const mapStateToProps = permission => (state) => {
  const displayComponent = R.contains(permission, state.session.permissions);
  return {
    displayComponent,
  };
};

export default (conditions = [true]) => WrappedComponent => connect(mapStateToProps(conditions))(
  (props) => {
    const { displayComponent, ...other } = props;
    if (!displayComponent) return null;

    return (
      <WrappedComponent
        {...other}
      />);
  },
);
