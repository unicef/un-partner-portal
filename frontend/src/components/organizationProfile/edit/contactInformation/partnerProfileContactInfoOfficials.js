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
  directos: 'Board of Director(s)',
  officers: 'Authorised Officer(s)',
};

const directorForm = (director, readOnly) => (
  <GridColumn>
    <GridRow columns={3}>
      <TextFieldForm
        fieldName={`${director}.fullname`}
        label="Full Name"
        warn
        readOnly={readOnly}
      />
      <TextFieldForm
        fieldName={`${director}.job_title`}
        label="Job Title/Position"
        warn
        readOnly={readOnly}
      />
      <RadioForm
        fieldName={`${director}.authorized`}
        values={BOOL_VAL}
        warn
        label="Authorised Officer?"
        readOnly={readOnly}
      />
    </GridRow>
    <GridRow columns={3}>
      <TextFieldForm
        fieldName={`${director}.telephone`}
        label="Telephone"
        warn
        readOnly={readOnly}
      />
      <TextFieldForm
        fieldName={`${director}.fax`}
        label="Fax (optional)"
        optional
        readOnly={readOnly}
      />
      <TextFieldForm
        fieldName={`${director}.email`}
        label="Email"
        warn
        readOnly={readOnly}
      />
    </GridRow>
  </GridColumn>
);

const authorisedOfficerForm = (officer, readOnly) => (
  <GridColumn>
    <GridRow columns={3}>
      <TextFieldForm
        fieldName={`${officer}.fullname`}
        label="Full Name"
        warn
        readOnly={readOnly}
      />
      <TextFieldForm
        fieldName={`${officer}.job_title`}
        label="Job Title/Position"
        warn
        readOnly={readOnly}
      />
    </GridRow>
    <GridRow columns={3}>
      <TextFieldForm
        fieldName={`${officer}.telephone`}
        label="Telephone"
        warn
        readOnly={readOnly}
      />
      <TextFieldForm
        fieldName={`${officer}.fax`}
        label="Fax (optional)"
        optional
        readOnly={readOnly}
      />
      <TextFieldForm
        fieldName={`${officer}.email`}
        label="Email"
        warn
        readOnly={readOnly}
      />
    </GridRow>
  </GridColumn>
);

const PartnerProfileContactInfoOfficials = (props) => {
  const { readOnly, hasBoardOfDirectors, hasAuthorisedOfficers } = props;

  return (<FormSection name="authorised_officials">
    <GridColumn>
      <RadioForm
        label={messages.boardOfDirectors}
        fieldName="have_board_directors"
        values={BOOL_VAL}
        warn
        readOnly={readOnly}
      />
      {visibleIfYes(hasBoardOfDirectors)
        ? <ArrayForm
          limit={15}
          initial
          label={messages.directos}
          fieldName="directors"
          outerField={director => directorForm(director, readOnly)}
          readOnly={readOnly}
        />
        : null}
      <RadioForm
        label={messages.authorisedOfficers}
        fieldName="have_authorised_officers"
        values={BOOL_VAL}
        warn
        readOnly={readOnly}
      />

      {visibleIfYes(hasAuthorisedOfficers) ?
        <ArrayForm
          limit={15}
          initial
          label={messages.officers}
          fieldName="authorised_officers"
          outerField={officer => authorisedOfficerForm(officer, readOnly)}
          readOnly={readOnly}
        />
        : null}
    </GridColumn>
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
