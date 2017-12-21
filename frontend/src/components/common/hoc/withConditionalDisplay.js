
// eslint-disable-next-line
import React from 'react';
import R from 'ramda';
import { connect } from 'react-redux';


const mapStateToProps = conditions => (state) => {
  const displayComponent = R.reduce((acc, next) => {
    if (typeof next === 'function') return acc && next(state);
    return acc && next;
  }, true, conditions);
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
