import React from 'react';
import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GridColumn from '../../../../common/grid/gridColumn';
import GridRow from '../../../../common/grid/gridRow';
import { email } from '../../../../../helpers/validation';
import TextFieldForm from '../../../../forms/textFieldForm';
import SelectForm from '../../../../forms/selectForm';
import RadioForm from '../../../../forms/radioForm';
import { FLAGS } from '../../../../../helpers/constants';
import FileForm from '../../../../forms/fileForm';
import { selectNormalizedFlagCategoryChoices, selectNormalizedFlagTypeChoices } from '../../../../../store';
import ObservationIcon from '../../icons/observationIcon';
import FlagIcon from '../../icons/flagIcon';
import EscalatedIcon from '../../icons/escalatedIcon';

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
};

const styleFlags = flags => flags.map((item) => {
  if (item.value === FLAGS.OBSERVATION) {
    const label = (<div style={{ display: 'flex', alignItems: 'center' }}><ObservationIcon /> {messages.flagObs}</div>);
    return { value: item.value, label };
  } else if (item.value === FLAGS.YELLOW) {
    const label = (<div style={{ display: 'flex', alignItems: 'center' }}><FlagIcon color={FLAGS.YELLOW} /> {messages.flagYel}</div>);
    return { value: item.value, label };
  } else if (item.value === FLAGS.RED) {
    const label = (<div style={{ display: 'flex', alignItems: 'center' }}><FlagIcon color={FLAGS.RED} /> {messages.flagRed}</div>);
    return { value: item.value, label };
  } else if (item.value === FLAGS.ESCALATED) {
    const label = (<div style={{ display: 'flex', alignItems: 'center' }}><EscalatedIcon /> {messages.flagEsc}</div>);
    return { value: item.value, label };
  } return { value: '', label: '' };
});

const AddVerification = (props) => {
  const { categoryChoices, flagTypes, flagSelected, handleSubmit } = props;

  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <RadioForm
          fieldName="flag_type"
          values={styleFlags(flagTypes)}
          label={messages.flagType}
          column
        />
        {flagSelected && flagSelected !== FLAGS.OBSERVATION && <GridRow>
          <SelectForm
            label={messages.categoryOfRisk}
            fieldName="category"
            values={categoryChoices}
          />
        </GridRow>}
        <TextFieldForm
          label={messages.comments}
          placeholder={messages.commentsHolder}
          fieldName="comment"
        />
        <TextFieldForm
          label={messages.contact}
          placeholder={messages.contactHolder}
          fieldName="contact_person"
          optional
        />
        <GridRow>
          <TextFieldForm
            label={messages.telephone}
            placeholder={messages.telephoneHolder}
            fieldName="contact_phone"
            optional
          />
          <TextFieldForm
            label={messages.email}
            placeholder={messages.emailHolder}
            fieldName="contact_email"
            validation={[email]}
            required
            textFieldProps={{
              "type": "email"
            }}
          />
        </GridRow>
        <FileForm
          label={messages.attachment}
          fieldName="attachment"
          optional
        />
      </GridColumn>
    </form >
  );
};

AddVerification.propTypes = {
  /**
  * callback for form submit
  */
  handleSubmit: PropTypes.func.isRequired,
  categoryChoices: PropTypes.array,
  flagTypes: PropTypes.array,
  flagSelected: PropTypes.string,
};

const formAddVerification = reduxForm({
  form: 'addFlag',
})(AddVerification);


const mapStateToProps = (state) => {
  const selector = formValueSelector('addFlag');
  return {
    categoryChoices: selectNormalizedFlagCategoryChoices(state),
    flagTypes: selectNormalizedFlagTypeChoices(state),
    flagSelected: selector(state, 'flag_type'),

    initialValues: {
      contact_person: state.session.name,
      contact_email: state.session.email,
    },
  };
};

export default connect(mapStateToProps)(formAddVerification);
