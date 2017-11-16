import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SelectForm from '../../selectForm';
import { selectNormalizedPopulationsOfConcernGroups } from '../../../../store';

const messages = {
  label: 'Intended population(s) of concern (for UNHCR-issued CFEIs only)',
};
// TODO make this only for agency=UNHCR
const SelectPopulationOfConcern = (props) => {
  const { values } = props;
  return (<SelectForm
    label={messages.label}
    fieldName="population"
    values={values}
    optional
  />);
};

SelectPopulationOfConcern.propTypes = {
  values: PropTypes.array.isRequired,
};

export default connect(state => ({
  values: selectNormalizedPopulationsOfConcernGroups(state),
}))(SelectPopulationOfConcern);
