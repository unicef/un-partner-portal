import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArrayForm from '../../../arrayForm';
import SelectForm from '../../../selectForm';
import JustificationField from './justificationField';
import JustificationSummary from './justificationSummary';
import AutocompleteForm from '../../../autoCompleteForm';
import { mapValuesForSelectionField } from '../../../../../store';
import { loadPartnerNamesForAutoComplete } from '../../../../../reducers/partnerNames';

const Partners = (getPartners, readOnly, ...props) => (member, index, fields) => {
  const chosenPartners = fields.getAll().map(field => field.partner);
  const ownPartner = fields.get(index).partner;
  return (<AutocompleteForm
    fieldName={`${member}.partner`}
    label="Partner"
    async
    asyncFunction={getPartners}
    readOnly={readOnly}
    search={'legal_name'}
    {...props}
  />
  );
};

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
  (dispatch, ownProps) => ({
    getPartners: params => dispatch(
      loadPartnerNamesForAutoComplete({ ...params }))
      .then(results => mapValuesForSelectionField(results)),
  }),
)(PartnersFieldArray);
