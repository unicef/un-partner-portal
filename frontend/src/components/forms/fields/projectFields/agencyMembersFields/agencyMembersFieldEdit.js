import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AutocompleteForm from '../../../autoCompleteForm';
import { mapValuesForSelectionField } from '../../../../../store';
import { loadAgencyMembersForAutoComplete } from '../../../../../reducers/agencyMembers';

// TODO: new version that supports autocomplete but can't be used right now
const AgencyMembersFieldEdit = (props) => {
  const { members, fieldName, label, getMembers, initial, ...other } = props;

  return (
    <AutocompleteForm
      fieldName={fieldName}
      label={label}
      async
      asyncFunction={getMembers}
      initial={initial}
      search={'name'}
      {...other}
    />
  );
};

AgencyMembersFieldEdit.propTypes = {
  fieldName: PropTypes.string,
  getMembers: PropTypes.func,
  label: PropTypes.string,
  initial: PropTypes.string,
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
    getMembers: params => dispatch(
      loadAgencyMembersForAutoComplete(params))
      .then(results => mapValuesForSelectionField(results)),
  }),
)(AgencyMembersFieldEdit);

