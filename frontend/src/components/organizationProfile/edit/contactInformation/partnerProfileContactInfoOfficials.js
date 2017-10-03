import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { connect } from 'react-redux';
import RadioForm from '../../../forms/radioForm';
import TextFieldForm from '../../../forms/textFieldForm';
import ArrayForm from '../../../forms/arrayForm';
import { visibleIfYes, BOOL_VAL } from '../../../../helpers/formHelper';
import GridRow from '../../../common/grid/gridRow';
import GridColumn from '../../../common/grid/gridColumn';

const messages = {
  boardOfDirectors: 'Does your organization have a board of director(s)?',
  authorisedOfficers: 'Does your organization have a authorised officer(s)?',
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

const AuthorisedOfficer = officer => (
  <GridColumn>
    <GridRow columns={4}>
      <TextFieldForm
        fieldName={`${officer}.first_name`}
        label="First Name"
        optional
        warn
      />
      <TextFieldForm
        fieldName={`${officer}.last_name`}
        label="Last Name"
        optional
        warn
      />
      <TextFieldForm
        fieldName={`${officer}.job_title`}
        label="Job Title/Position"
        optional
        warn
      />
    </GridRow>
    <GridRow columns={4}>
      <TextFieldForm
        fieldName={`${officer}.telephone`}
        label="First Name"
        optional
        warn
      />
      <TextFieldForm
        fieldName={`${officer}.fax`}
        label="Last Name"
        optional
        warn
      />
      <TextFieldForm
        fieldName={`${officer}.email`}
        label="Job Title/Position"
        optional
        warn
      />
    </GridRow>
  </GridColumn>
);

const PartnerProfileContactInfoOfficials = (props) => {
  const { readOnly, hasBoardOfDirectors, hasAuthorisedOfficers } = props;

  return (<FormSection name="authorised_officials">
    <Grid container direction="column" spacing={16}>
      <Grid item sm={12} xs={12}>
        <RadioForm
          label={messages.boardOfDirectors}
          fieldName="have_board_directors_a"
          values={BOOL_VAL}
          optional
          warn
          readOnly={readOnly}
        />
      </Grid>
      {visibleIfYes(hasBoardOfDirectors) && <Grid item sm={12} xs={12}>
        <ArrayForm
          limit={15}
          initial
          fieldName="directors"
          outerField={Director}
        />
      </Grid>}
      <Grid item sm={12} xs={12}>
        <RadioForm
          label={messages.authorisedOfficers}
          fieldName="have_authorised_officers_a"
          values={BOOL_VAL}
          optional
          warn
          readOnly={readOnly}
        />
      </Grid>

      {visibleIfYes(hasAuthorisedOfficers) && <Grid item sm={12} xs={12}>
        <ArrayForm
          limit={15}
          initial
          fieldName="authorised_officers"
          outerField={AuthorisedOfficer}
        />
      </Grid>}
    </Grid>
  </FormSection>
  );
};

PartnerProfileContactInfoOfficials.propTypes = {
  readOnly: PropTypes.bool,
  hasBoardOfDirectors: PropTypes.bool,
  hasAuthorisedOfficers: PropTypes.bool,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    hasBoardOfDirectors: selector(state, 'mailing.authorised_officials.have_board_directors'),
    hasAuthorisedOfficers: selector(state, 'mailing.authorised_officials.have_authorised_officers'),
  }),
)(PartnerProfileContactInfoOfficials);
