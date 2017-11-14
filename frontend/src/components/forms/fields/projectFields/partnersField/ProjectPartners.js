import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AutocompleteForm from '../../../autoCompleteForm';
import { mapValuesForSelectionField } from '../../../../../store';
import { loadPartnerNamesForAutoComplete } from '../../../../../reducers/partnerNames';

const ProjectPartners = (props) => {
  const { fieldName, label, getPartners, ...other } = props;
  return (
    <AutocompleteForm
      fieldName={fieldName}
      label={label}
      async
      asyncFunction={getPartners}
      multiple
      search={'legal_name'}
      {...other}
    />
  );
};

ProjectPartners.propTypes = {
  fieldName: PropTypes.string,
  label: PropTypes.string,
  getPartners: PropTypes.array,
  disabled: PropTypes.bool,
};

ProjectPartners.defaultProps = {
  countries: [],
};

export default connect(
  null,
  dispatch => ({
    getPartners: params => dispatch(
      loadPartnerNamesForAutoComplete({ ...params }))
      .then(results => mapValuesForSelectionField(results)),
  }),
)(ProjectPartners);
