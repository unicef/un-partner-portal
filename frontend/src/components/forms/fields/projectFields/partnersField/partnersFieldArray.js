import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArrayForm from '../../../arrayForm';
import GridColumn from '../../../../common/grid/gridColumn';
import JustificationField from './justificationField';
import JustificationSummary from './justificationSummary';
import AutocompleteForm from '../../../autoCompleteForm';
import FileForm from '../../../fileForm';
import { mapValuesForSelectionField } from '../../../../../store';
import { loadPartnerNamesForAutoComplete } from '../../../../../reducers/partnerNames';

const messages = {
  attachment: 'Attachment (Optional)',
};

const Partner = (getPartners, readOnly, partnerName, hidePartner, ...props) => (member, index, fields) => (
  <GridColumn>
    {!hidePartner && <AutocompleteForm
      fieldName={`${member}.partner`}
      label="Partner"
      async
      multiple
      multipleSize={1}
      asyncFunction={getPartners}
      readOnly={readOnly}
      initialMultiValues={partnerName ? [partnerName] : []}
      search={'legal_name'}
      extra={'no_flags=FL4_Red'}
      {...props}
    />}
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
    <FileForm
      fieldName={`${member}.ds_attachment`}
      formName="newDirectCfei"
      label={messages.attachment}
      optional
      readOnly={readOnly}
    />
  </GridColumn>);

const PartnersFieldArray = (props) => {
  const { getPartners, readOnly, partnerName, hidePartner, ...other } = props;
  return (
    <ArrayForm
      label=""
      limit={1}
      fieldName="applications"
      initial
      readOnly={readOnly}
      {...other}
      outerField={Partner(getPartners, readOnly, partnerName, hidePartner, ...other)}
    />
  );
};

PartnersFieldArray.propTypes = {
  getPartners: PropTypes.func,
  readOnly: PropTypes.bool,
  hidePartner: PropTypes.bool,
  partnerName: PropTypes.string,
};


export default connect(
  null,
  dispatch => ({
    getPartners: params => dispatch(
      loadPartnerNamesForAutoComplete({ ...params }))
      .then(results => mapValuesForSelectionField(results)),
  }),
)(PartnersFieldArray);
