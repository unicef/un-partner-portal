import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArrayForm from '../../../arrayForm';
import GridColumn from '../../../../common/grid/gridColumn';
import JustificationField from './justificationField';
import JustificationSummary from './justificationSummary';
import AutocompleteForm from '../../../autoCompleteForm';
import { mapValuesForSelectionField } from '../../../../../store';
import { loadPartnerNamesForAutoComplete } from '../../../../../reducers/partnerNames';

const Partner = (getPartners, readOnly, ...props) => (member, index, fields) => (
  <GridColumn>
    <AutocompleteForm
      fieldName={`${member}.partner`}
      label="Partner"
      async
      asyncFunction={getPartners}
      readOnly={readOnly}
      search={'legal_name'}
      {...props}
    />
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
  </GridColumn>);

const PartnersFieldArray = (props) => {
  const { getPartners, readOnly, ...other } = props;
  return (
    <ArrayForm
      label=""
      limit={1}
      fieldName="applications"
      initial
      readOnly={readOnly}
      {...other}
      outerField={Partner(getPartners, readOnly, ...other)}
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
