import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectForm from '../../../selectForm';

import { mapFocalPointsReviewersToSelection } from '../../../../../store';

const AgencyMembersField = (props) => {
  const { members, fieldName, label, ...other } = props;
  return (
    <SelectForm
      fieldName={fieldName}
      label={label}
      values={members}
      selectFieldProps={{
        multiple: true,
      }}
      {...other}
    />
  );
};

AgencyMembersField.propTypes = {
  fieldName: PropTypes.string,
  label: PropTypes.string,
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
  state => (
    { members: mapFocalPointsReviewersToSelection(state),
    }),
)(AgencyMembersField);

/**
 * TODO: new version that supports autocomplete but can't be used right now
 * const AgencyMembersField = (props) => {
  const { members, fieldName, label, getMembers, ...other } = props;
  return (
    <AutocompleteForm
      fieldName={fieldName}
      label={label}
      async
      asyncFunction={getMembers}
      multiple
      {...other}
    />
  );
};

AgencyMembersField.propTypes = {
  fieldName: PropTypes.string,
  label: PropTypes.string,
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
  state => (
    {
      getMembers: params =>
        loadAgencyMembersForAutoComplete(state.session.agencyId, params).then(results =>
          mapValuesForSelectionField(results)),
    }),
)(AgencyMembersField);

 */