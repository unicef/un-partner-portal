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
  accreditation: 'Accreditation',
  date: 'Date Received',
  certifying: 'Certifying/Accrediting Body',
  info: 'Would you like to upload any accreditations received by your organization?',
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
  const { readOnly, hasAccreditations } = props;

  return (<FormSection name="accreditation">
    <RadioForm
      fieldName="has_partnership"
      label={messages.info}
      values={BOOL_VAL}
      warn
      readOnly={readOnly}
    />
    {visibleIfYes(hasAccreditations)
      ? <ArrayForm
        fieldName="accreditations"
        initial
        limit={15}
        readOnly={readOnly}
        outerField={Accreditation(readOnly)}
        innerField={AccreditationInner(readOnly)}
      />
      : null}
  </FormSection>
  );
};

PartnerProfileCollaborationAccreditation.propTypes = {
  readOnly: PropTypes.bool,
  hasAccreditations: PropTypes.bool,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    hasAccreditations: selector(state, 'collaboration.history.partnership_collaborate_institution'),
  }),
)(PartnerProfileCollaborationAccreditation);
