import React from 'react';
import R from 'ramda';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Grid } from 'material-ui';
import PropTypes from 'prop-types';
import GridColumn from '../../../../common/grid/gridColumn';
import GridRow from '../../../../common/grid/gridRow';
import { email } from '../../../../../helpers/validation';
import TextFieldForm from '../../../../forms/textFieldForm';
import SelectForm from '../../../../forms/selectForm';
import FileForm from '../../../../forms/fileForm';
import { selectNormalizedFlagCategoryChoices, selectNormalizedFlagTypeChoices } from '../../../../../store';
import ArrayForm from '../../../../forms/arrayForm';
import RadioForm from '../../../../forms/radioForm';

const messages = {
  comments: 'Comments',
  commentsHolder: 'Enter additional details...',
  contact: 'Contact person (optional)',
  contactHolder: 'Full name...',
  telephone: 'Telephone (optional)',
  telephoneHolder: 'Enter telephone...',
  email: 'E-mail',
  emailHolder: 'Enter e-mail...',
  attachment: 'Attachment (optional)',
  categoryOfRisk: 'Category of risk',
  flagType: 'Does this observation relate to fraud, corruption, ethical concern or other reputational risk?',
  flagObs: 'No, not risk-related',
  flagYel: 'Yes, add risk flag',
  flagRed: 'Yes, add red flag',
  flagEsc: 'Yes, add risk flag and escalate to UN Headquarters Editor',
  reason: 'Reason for decision',
  enterDetails: 'Enter additional details...',
};

export const OBSERVATION_DECISION = {
  NO_VALID: 'NV',
  ESCALATE: 'EF',
};

const radioFlag = [
  {
    value: OBSERVATION_DECISION.NO_VALID,
    label: 'This flag is no longer valid',
  },
  {
    value: OBSERVATION_DECISION.ESCALATE,
    label: 'Escalate to UN Headquarters Editor',
  },
];

const commentFormControlStyle = {
  paddingBottom: '12px',
  paddingTop: '12px',
};

const Decision = () => () => (
  <Grid container>
    <Grid item sm={12} xs={12}>
      <RadioForm
        fieldName="reason_radio"
        values={radioFlag}
      />
      <TextFieldForm
        commentFormControlStyle={commentFormControlStyle}
        label={messages.reason}
        placeholder={messages.enterDetails}
        fieldName="validation_comment"
      />
    </Grid>
  </Grid>
);

const UpdateObservationForm = (props) => {
  const { categoryChoices, flagTypes, handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <SelectForm
          label={messages.categoryOfRisk}
          fieldName="category"
          readOnly
          values={categoryChoices}
        />
        <TextFieldForm
          label={messages.comments}
          readOnly
          placeholder={messages.commentsHolder}
          fieldName="comment"
        />
        <TextFieldForm
          label={messages.contact}
          placeholder={messages.contactHolder}
          fieldName="contact_person"
          optional
          readOnly
        />
        <GridRow>
          <TextFieldForm
            label={messages.telephone}
            placeholder={messages.telephoneHolder}
            fieldName="contact_phone"
            optional
            readOnly
          />
          <TextFieldForm
            label={messages.email}
            placeholder={messages.emailHolder}
            fieldName="contact_email"
            validation={[email]}
            required
            readOnly
          />
        </GridRow>
        <FileForm
          label={messages.attachment}
          fieldName="attachment"
          optional
          readOnly
        />
        <ArrayForm
          limit={1}
          fieldName="flag_decision"
          disableDeleting
          initial
          outerField={Decision()}
        />
      </GridColumn>
    </form >
  );
};

UpdateObservationForm.propTypes = {
  /**
  * callback for form submit
  */
  handleSubmit: PropTypes.func.isRequired,
  categoryChoices: PropTypes.array,
  flagTypes: PropTypes.array,
};

const formUpdateObservation = reduxForm({
  form: 'updateObservationForm',
})(UpdateObservationForm);


const mapStateToProps = (state, ownProps) => {
  const observation = R.find(R.propEq('id', ownProps.id), state.partnerObservationsList.items);

  return {
    categoryChoices: selectNormalizedFlagCategoryChoices(state),
    flagTypes: selectNormalizedFlagTypeChoices(state),

    initialValues: {
      contact_person: observation.contactPerson,
      contact_phone: observation.contactPhone,
      contact_email: observation.contactEmail,
      attachment: observation.attachment,
      category: observation.category,
      comment: observation.comment,
    },
  };
};

export default connect(
  mapStateToProps,
  null,
)(formUpdateObservation);
