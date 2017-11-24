import React from 'react';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import ArrayForm from '../../../forms/arrayForm';
import DatePickerForm from '../../../forms/datePickerForm';
import FileForm from '../../../forms/fileForm';
import TextFieldForm from '../../../forms/textFieldForm';

const messages = {
  accreditation: 'Accreditation',
  date: 'Date Received',
  certifying: 'Certifying/Accrediting Body',
};

const Accreditation = readOnly => member => (
  <Grid container direction="row">
    <Grid item sm={6} xs={12} >
      <TextFieldForm
        label={messages.certifying}
        fieldName={`${member}.organization_name`}
        warn
        readOnly={readOnly}
      />
    </Grid>
  </Grid>
);

const AccreditationInner = readOnly => member => (
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
        sectionName="collaboration.accreditation"
        formName="partnerProfile"
        fieldName={`${member}.evidence_file`}
        label={messages.accreditation}
        warn
        readOnly={readOnly}
      />
    </Grid>
  </Grid>
);

const PartnerProfileCollaborationAccreditation = (props) => {
  const { readOnly } = props;

  return (<FormSection name="accreditation">
    <ArrayForm
      fieldName="accreditations"
      initial
      limit={15}
      readOnly={readOnly}
      outerField={Accreditation(readOnly)}
      innerField={AccreditationInner(readOnly)}
    />
  </FormSection>
  );
};

PartnerProfileCollaborationAccreditation.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileCollaborationAccreditation;
