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
  const { values, readOnly } = props;
  return (<SelectForm
    label={messages.label}
    fieldName="populations_of_concern"
    values={values}
    readOnly={readOnly}
    optional
    multiple
  />);
};

SelectPopulationOfConcern.propTypes = {
  values: PropTypes.array.isRequired,
  readOnly: PropTypes.bool,
};

export default connect(state => ({
  values: selectNormalizedPopulationsOfConcernGroups(state),
}))(SelectPopulationOfConcern);
