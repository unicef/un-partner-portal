import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { connect } from 'react-redux';
import RadioForm from '../../../forms/radioForm';
import TextFieldForm from '../../../forms/textFieldForm';
import ArrayForm from '../../../forms/arrayForm';
import { visibleIf, BOOL_VAL } from '../../../../helpers/formHelper';
import GridRow from '../../../common/grid/gridRow';

const messages = {
  boardOfDirectors: 'Does your organization have a board of directors?',
};

const Director = director => (

  <GridRow columns={4}>
    <TextFieldForm
      fieldName={`${director}.first_name`}
      label="First Name"
      optional
      warn
    />
    <TextFieldForm
      fieldName={`${director}.last_name`}
      label="Last Name"
      optional
      warn
    />
    <TextFieldForm
      fieldName={`${director}.job_title`}
      label="Job Title/Position"
      optional
      warn
    />
    <RadioForm
      fieldName={`${director}.authorized`}
      values={BOOL_VAL}
      optional
      warn
      label="Authorised Officer?"
    />
  </GridRow>

);

const PartnerProfileContactInfoOfficials = (props) => {
  const { readOnly, hasBoardOfDirectors } = props;

  return (<FormSection name="authorised_officials">
    <Grid container direction="column" spacing={16}>
      <Grid item sm={12} xs={12}>
        <RadioForm
          label={messages.boardOfDirectors}
          fieldName="have_board_directors"
          values={BOOL_VAL}
          optional
          warn
          readOnly={readOnly}
        />
      </Grid>

      {visibleIf(hasBoardOfDirectors) && <Grid item sm={12} xs={12}>
        <ArrayForm
          limit={15}
          fieldName="directors"
          outerField={Director}
        />
      </Grid>}

      <Grid item>
        <Grid container direction="row">
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="First Name"
              placeholder=""
              fieldName="firstName"
              readOnly={readOnly}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Last Name"
              placeholder=""
              fieldName="lastName"
              readOnly={readOnly}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Job Title/Position"
              placeholder=""
              fieldName="job"
              readOnly={readOnly}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <RadioForm
              fieldName="isAuthorisedOfficer"
              label="Authorised Officer?"
              values={BOOL_VAL}
              readOnly={readOnly}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="First Name"
              placeholder=""
              fieldName="firstName"
              readOnly={readOnly}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Last Name"
              placeholder=""
              fieldName="lastName"
              readOnly={readOnly}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Job Title/Position"
              placeholder=""
              fieldName="job"
              readOnly={readOnly}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </FormSection>
  );
};

PartnerProfileContactInfoOfficials.propTypes = {
  readOnly: PropTypes.bool,
  hasBoardOfDirectors: PropTypes.bool,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    hasBoardOfDirectors: selector(state, 'mailing.authorised_officials.have_board_directors'),
  }),
)(PartnerProfileContactInfoOfficials);
