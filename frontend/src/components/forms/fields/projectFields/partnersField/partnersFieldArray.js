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

const Partner = (getPartners, readOnly, partnername, ...props) => (member, index, fields) => (
  <GridColumn>
    <AutocompleteForm
      fieldName={`${member}.partner`}
      label="Partner"
      async
      asyncFunction={getPartners}
      readOnly={readOnly}
      initial={partnername}
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
    <FileForm
      fieldName={`${member}.ds_attachment`}
      formName="newDirectCfei"
      label={messages.attachment}
      optional
    />
  </GridColumn>);

const PartnersFieldArray = (props) => {
  const { getPartners, readOnly, partnername, ...other } = props;
  console.log('PARTNERNAME IS', partnername);
  return (
    <ArrayForm
      label=""
      limit={1}
      fieldName="applications"
      initial
      readOnly={readOnly}
      {...other}
      outerField={Partner(getPartners, readOnly, partnername, ...other)}
    />
  );
};

PartnersFieldArray.propTypes = {
  getPartners: PropTypes.func,
  readOnly: PropTypes.bool,
  partnername: PropTypes.number,
};


export default connect(
  null,
  dispatch => ({
    getPartners: params => dispatch(
      loadPartnerNamesForAutoComplete({ ...params }))
      .then(results => mapValuesForSelectionField(results)),
  }),
)(PartnersFieldArray);

// dodac number id do focal pointa

    //  selectorem musze wybrac wszystkie aktualne wartosci z redux forma z formularza
    //  i sprawdzic czy jest number czy string - jesli string, to wywal z payloadu,
    //  jak number, to leci dalej w payloadzie
