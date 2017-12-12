import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import ArrayForm from '../../../forms/arrayForm';
import DatePickerForm from '../../../forms/datePickerForm';
import { visibleIfYes, BOOL_VAL } from '../../../../helpers/formHelper';
import RadioForm from '../../../forms/radioForm';
import FileForm from '../../../forms/fileForm';
import TextFieldForm from '../../../forms/textFieldForm';

const messages = {
  reference: 'Reference',
  date: 'Date Received',
  referring: 'Name of referring organization',
  info: 'Would you like to upload any reference letters for your organization?',
};

const Reference = readOnly => member => (
  <Grid container direction="row">
    <Grid item sm={6} xs={12} >
      <TextFieldForm
        label={messages.referring}
        fieldName={`${member}.organization_name`}
        warn
        readOnly={readOnly}
      />
    </Grid>
  </Grid>
);

const ReferenceInner = readOnly => member => (
  <Grid container direction="row">
    <Grid item sm={6} xs={12} >
      <DatePickerForm
        label={messages.date}
        fieldName={`${member}.date_received`}
        warn
        readOnly={readOnly}
      />
    </Grid>
    <Grid item sm={6} xs={12} >
      <FileForm
        sectionName="collaboration.reference"
        formName="partnerProfile"
        fieldName={`${member}.evidence_file`}
        label={messages.reference}
        warn
        readOnly={readOnly}
      />
    </Grid>
  </Grid>
);

const PartnerProfileCollaborationReferences = (props) => {
  const { readOnly, hasReferences } = props;

  return (<FormSection name="reference">
    <RadioForm
      fieldName="has_partnership"
      label={messages.info}
      values={BOOL_VAL}
      warn
      readOnly={readOnly}
    />
    {visibleIfYes(hasReferences)
      ? <ArrayForm
        fieldName="references"
        initial
        limit={15}
        readOnly={readOnly}
        outerField={Reference(readOnly)}
        innerField={ReferenceInner(readOnly)}
      />
      : null}
  </FormSection>
  );
};

PartnerProfileCollaborationReferences.propTypes = {
  readOnly: PropTypes.bool,
  hasReferences: PropTypes.bool,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    hasReferences: selector(state, 'collaboration.history.partnership_collaborate_institution'),
  }),
)(PartnerProfileCollaborationReferences);
