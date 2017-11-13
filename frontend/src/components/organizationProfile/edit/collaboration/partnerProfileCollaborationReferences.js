import React from 'react';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import ArrayForm from '../../../forms/arrayForm';
import DatePickerForm from '../../../forms/datePickerForm';
import FileForm from '../../../forms/fileForm';
import TextFieldForm from '../../../forms/textFieldForm';

const messages = {
  reference: 'Reference',
  date: 'Date Received',
  referring: 'Name of referring organization',
};

const Reference = readOnly => member => (
  <Grid container direction="row">
    <Grid item sm={6} xs={12} >
      <TextFieldForm
        label={messages.referring}
        fieldName={`${member}.organization_name`}
        optional
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
        optional
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
        optional
        warn
        readOnly={readOnly}
      />
    </Grid>
  </Grid>
);

const PartnerProfileCollaborationReferences = (props) => {
  const { readOnly } = props;

  return (<FormSection name="reference">
    <ArrayForm
      fieldName="references"
      initial
      limit={15}
      readOnly={readOnly}
      outerField={Reference(readOnly)}
      innerField={ReferenceInner(readOnly)}
    />
  </FormSection>
  );
};

PartnerProfileCollaborationReferences.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileCollaborationReferences;
