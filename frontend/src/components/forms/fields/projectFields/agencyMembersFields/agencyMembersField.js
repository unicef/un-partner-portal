import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AutocompleteForm from '../../../autoCompleteForm';
import { mapValuesForSelectionField } from '../../../../../store';
import { loadAgencyMembersForAutoComplete } from '../../../../../reducers/agencyMembers';

// TODO: new version that supports autocomplete but can't be used right now
const AgencyMembersField = (props) => {
  const { members, fieldName, label, getMembers, initialMultiValues, ...other } = props;
  return (
    <AutocompleteForm
      fieldName={fieldName}
      label={label}
      async
      asyncFunction={getMembers}
      initialMultiValues={initialMultiValues}
      multiple
      search={'name'}
      {...other}
    />
  );
};

AgencyMembersField.propTypes = {
  fieldName: PropTypes.string,
  label: PropTypes.string,
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
  null,
  dispatch => ({
    getMembers: params => dispatch(loadAgencyMembersForAutoComplete(params)).then(results =>
      mapValuesForSelectionField(results)),
  }),
)(AgencyMembersField);

