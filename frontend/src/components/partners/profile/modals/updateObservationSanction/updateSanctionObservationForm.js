import React from 'react';
import R from 'ramda';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid } from 'material-ui';
import GridColumn from '../../../../common/grid/gridColumn';
import TextFieldForm from '../../../../forms/textFieldForm';
import SelectForm from '../../../../forms/selectForm';
import { selectNormalizedFlagCategoryChoices, selectNormalizedFlagTypeChoices } from '../../../../../store';
import ArrayForm from '../../../../forms/arrayForm';
import RadioForm from '../../../../forms/radioForm';

const messages = {
  comments: 'Comments',
  categoryOfRisk: 'Category of risk',
  decision: 'Reason for decision',
  enterDetails: 'Enter additional details...',
};

export const SANCATION_DECISION = {
  NOTMATCH: 'NM',
  CONFIRMED: 'CM',
};


const radioFlag = [
  {
    value: SANCATION_DECISION.NOTMATCH,
    label: 'Not a true Match',
  },
  {
    value: SANCATION_DECISION.CONFIRMED,
    label: 'Confirmed Match',
  },
];

const commentFormControlStyle = {
  padding: '12px 0',
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
        label={messages.decision}
        placeholder={messages.enterDetails}
        fieldName="validation_comment"
      />
    </Grid>
  </Grid>
);

const UpdateSanctionObservationForm = (props) => {
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

UpdateSanctionObservationForm.propTypes = {
  /**
  * callback for form submit
  */
  handleSubmit: PropTypes.func.isRequired,
  categoryChoices: PropTypes.array,
};

const formUpdateSanctionObservation = reduxForm({
  form: 'updateSanctionObservationForm',
})(UpdateSanctionObservationForm);


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
)(formUpdateSanctionObservation);
