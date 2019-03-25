import React from 'react';
import R from 'ramda';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid } from 'material-ui';
import GridColumn from '../../../../common/grid/gridColumn';
import GridRow from '../../../../common/grid/gridRow';
import { email } from '../../../../../helpers/validation';
import TextFieldForm from '../../../../forms/textFieldForm';
import SelectForm from '../../../../forms/selectForm';
import FileForm from '../../../../forms/fileForm';
import { selectNormalizedFlagCategoryChoices } from '../../../../../store';
import ArrayForm from '../../../../forms/arrayForm';
import RadioForm from '../../../../forms/radioForm';
import FlagIcon from '../../icons/flagIcon';
import { FLAGS } from '../../../../../helpers/constants';

const messages = {
  comments: 'Comments',
  contact: 'Contact person (optional)',
  telephone: 'Telephone (optional)',
  email: 'E-mail',
  attachment: 'Attachment (optional)',
  categoryOfRisk: 'Category of risk',
  defer: 'Having reviewed the risk observation escalated by the Country Office, UN HQ has determined that:',
  defferedInfo: 'The risk is deferred to the Country Office for local decision-making.',
  confirmedInfo: 'No partnership should take place with the flagged organization.',
  comment: 'Comment',
};

export const ESCALATION_DECISION = {
  DEFFERED: 'DB',
  CONFIRMED: 'EF',
};

const radioFlag = [
  {
    value: ESCALATION_DECISION.DEFFERED,
    label: <div style={{ display: 'flex', alignItems: 'center' }}><FlagIcon color={FLAGS.YELLOW} />
      {messages.defferedInfo}
    </div>,
  },
  {
    value: ESCALATION_DECISION.CONFIRMED,
    label: <div style={{ display: 'flex', alignItems: 'center' }}>
      <FlagIcon color={FLAGS.RED} />
      {messages.confirmedInfo}
      {}
    </div>,
  },
];

const Decision = () => () => (<Grid container>
  <Grid item sm={12} xs={12}>
    <RadioForm
      fieldName="reason_radio"
      values={radioFlag}
    />
  </Grid>
</Grid>);

const UpdateEscalatedObservationForm = (props) => {
  const { categoryChoices, handleSubmit } = props;
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
          fieldName="comment"
        />
        <TextFieldForm
          label={messages.contact}
          fieldName="contact_person"
          optional
          readOnly
        />
        <GridRow>
          <TextFieldForm
            label={messages.telephone}
            fieldName="contact_phone"
            optional
            readOnly
          />
          <TextFieldForm
            label={messages.email}
            fieldName="contact_email"
            validation={[email]}
            required
            readOnly
            textFieldProps={{
              "type": "email"
            }}
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
          label={messages.defer}
          outerField={Decision()}
        />
        <TextFieldForm
          label={messages.comment}
          fieldName="escalation_comment"
          required
        />
      </GridColumn>
    </form >
  );
};

UpdateEscalatedObservationForm.propTypes = {
  /**
  * callback for form submit
  */
  handleSubmit: PropTypes.func.isRequired,
  categoryChoices: PropTypes.array,
};

const formUpdateEscalatedObservation = reduxForm({
  form: 'updateEscalatedObservationForm',
})(UpdateEscalatedObservationForm);


const mapStateToProps = (state, ownProps) => {
  const observation = R.find(R.propEq('id', ownProps.id), state.partnerObservationsList.items);

  return {
    categoryChoices: selectNormalizedFlagCategoryChoices(state),

    initialValues: {
      contact_person: observation.contactPerson,
      contact_phone: observation.contactPhone,
      contact_email: observation.contactEmail,
      attachment: observation.attachment,
      category: observation.category,
      comment: observation.comment,
      isEscalated: observation.isEscalated,
    },
  };
};

export default connect(
  mapStateToProps,
  null,
)(formUpdateEscalatedObservation);
