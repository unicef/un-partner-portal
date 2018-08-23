import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import AutocompleteForm from '../../../autoCompleteForm';
import { mapValuesForSelectionField } from '../../../../../store';
import { loadAgencyFocalPointsForAutoComplete } from '../../../../../reducers/agencyMembers';

// TODO: new version that supports autocomplete but can't be used right now
const AgencyMembersField = (props) => {
  const { members, fieldName, label, values, getMembers, initialMultiValues, ...other } = props;
  return (
    <AutocompleteForm
      fieldName={fieldName}
      label={label}
      async
      asyncFunction={getMembers}
      initialMultiValues={initialMultiValues}
      multiple
      currentValues={values}
      search={'name'}
      {...other}
    />
  );
};

AgencyMembersField.propTypes = {
  fieldName: PropTypes.string,
  label: PropTypes.string,
  getMembers: PropTypes.func,
  values: PropTypes.array,
  initialMultiValues: PropTypes.array,
  members: PropTypes.arrayOf(
    PropTypes.objectOf(
      {
        value: PropTypes.string,
        label: PropTypes.string,
      },
    ),
  ),
  disabled: PropTypes.bool,
};


export default connect(
  (state, ownProps) => {
    let values;

    if (ownProps.formName) {
      const selector = formValueSelector(ownProps.formName);
      values = selector(state, ownProps.fieldName);
    }

    return {
      values: values || [],
    };
  },
  dispatch => ({
    getMembers: params => dispatch(loadAgencyFocalPointsForAutoComplete(params)).then(results =>
      mapValuesForSelectionField(results)),
  }),
  null,
  { withRef: true },
)(AgencyMembersField);

