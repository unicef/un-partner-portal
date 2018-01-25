import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArrayForm from '../../../arrayForm';

import JustificationField from './justificationField';
import JustificationSummary from './justificationSummary';
import AutocompleteForm from '../../../autoCompleteForm';
import { mapValuesForSelectionField } from '../../../../../store';
import { loadPartnerNamesForAutoComplete } from '../../../../../reducers/partnerNames';

const Partners = (getPartners, readOnly, ...props) => member => (<AutocompleteForm
  fieldName={`${member}.partner`}
  label="Partner"
  async
  asyncFunction={getPartners}
  readOnly={readOnly}
  search={'legal_name'}
  {...props}
/>);

const Justification = (readOnly, ...props) => (member, index, fields) => (
  <div >
    <JustificationField
      name={member}
      disabled={!fields.get(index).partner}
      readOnly={readOnly}
      {...props}
    />
    <JustificationSummary
      name={member}
      disabled={!fields.get(index).partner}
      readOnly={readOnly}
      {...props}
    />

  </div>
);


const PartnersFieldArray = (props) => {
  const { getPartners, readOnly, ...other } = props;
  return (
    <ArrayForm
      label=""
      limit={16}
      fieldName="applications"
      initial
      readOnly={readOnly}
      {...other}
      outerField={Partners(getPartners, readOnly, ...other)}
      innerField={Justification(readOnly, ...other)}
    />
  );
};

PartnersFieldArray.propTypes = {
  getPartners: PropTypes.func,
  readOnly: PropTypes.bool,
};


export default connect(
  null,
  dispatch => ({
    getPartners: params => dispatch(
      loadPartnerNamesForAutoComplete({ is_verified: 'verified', ...params }))
      .then(results => mapValuesForSelectionField(results)),
  }),
)(PartnersFieldArray);
