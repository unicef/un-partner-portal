import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { pluck } from 'ramda';
import ArrayForm from '../../../arrayForm';
import SelectForm from '../../../selectForm';
import TextFieldForm from '../../../textFieldForm';
import GridColumn from '../../../../common/grid/gridColumn';
import JustificationField from './justificationField';
import JustificationSummary from './justificationSummary';
import AutocompleteForm from '../../../autoCompleteForm';
import FileForm from '../../../fileForm';
import { mapValuesForSelectionField } from '../../../../../store';
import { loadPartnerNamesForAutoComplete } from '../../../../../reducers/partnerNames';

const messages = {
  attachment: 'Attachment (Optional)',
  justification: 'Justification for Direct Selection/Retention',
};

const justificationValues = [
  { value: 'Kno', label: 'Known expertise' },
  { value: 'Loc', label: 'Local presence' },
  { value: 'Inn', label: 'Innovative approach' },
  { value: 'TCC', label: 'Time constraints/criticality of response' },
  { value: 'Imp', label: 'Importance of strengthening national civil society engagement' },
  { value: 'Oth', label: 'Other' },
];

const PartnersFieldArrayEdit = (props) => {
  const { getPartners, readOnly, partnername, dsjust, ...other } = props;
  return (
    <GridColumn>
      <AutocompleteForm
        fieldName="partner_name"
        label="Partner"
        placeholder="yyy"
        initialMultiValues={partnername}
        multiple
        {...props}
      />
      <SelectForm
        fieldName="ds_justification_select"
        label={messages.justification}
        values={justificationValues}
        multiple
        initialMultiValues={dsjust}
        // selectFieldProps={{
        //   disabled,
        // }}
        {...other}
      />
      <TextFieldForm
        fieldName="justification_reason"
        label={messages.label}
        placeholder="lala"
        textFieldProps={{
          multiline: true,
          InputProps: {
            inputProps: {
              maxLength: '5000',
            },
          },
        }}
        {...other}
      />
      <FileForm
        fieldName="ds_attachment"
        label={messages.attachment}
        optional
      />
    </GridColumn>
  );
};

PartnersFieldArrayEdit.propTypes = {
  getPartners: PropTypes.func,
  readOnly: PropTypes.bool,
};

const partnerArrayForm = reduxForm({
  form: 'partnerArray',
})(PartnersFieldArrayEdit);

const mapStateToProps = (state, ownProps) => {
  const partner = ownProps.partner;
  console.log('DS Partner is :: ', partner);
  const partnername = pluck('partner_name', partner);
  const partnerr = partner[0].partner_name;
  console.log('partnername', partnername);
  console.log('partner name not in array IS :: ', partnerr);
  const dsJustificationSelect = partner[0].ds_justification_select;
  const justificationReason = partner[0].justification_reason;
  const dsAttachment = partner[0].ds_attachment;
  return {
    partner,
    partnername,
    dsJustificationSelect,
    initialValues: {
      applications: partner,
      partner_name: partnerr,
      ds_justification_select: dsJustificationSelect,
      justification_reason: justificationReason,
      ds_attachment: dsAttachment,
    },
  };
};

export default connect(
  mapStateToProps,
  // dispatch => ({
  //   getPartners: params => dispatch(
  //     loadPartnerNamesForAutoComplete({ is_verified: 'verified', ...params }))
  //     .then(results => mapValuesForSelectionField(results)),
  // }),
)(partnerArrayForm);
