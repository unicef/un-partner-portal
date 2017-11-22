import R from 'ramda';
import React from 'react';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArrayForm from '../../../forms/arrayForm';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';
import { selectNormalizedBudgets } from '../../../../store';

const messages = {
  annualBudget: 'What is your organization\'s annual budget (in USD) for the current and two previous years?',
  budget: 'Budget',
  year: 'Year',
};

const isReadOnly = (isHq, displayType, readOnly) => readOnly || (!isHq && displayType === 'Int');

const annualBudgetForm = (budget, budgetTypes, readOnly) => (
  <Grid container direction="row">
    <Grid item sm={2} xs={12} >
      <TextFieldForm
        fieldName={`${budget}.year`}
        label={messages.year}
        readOnly
      />
    </Grid>
    <Grid item sm={10} xs={12} >
      <SelectForm
        fieldName={`${budget}.budget`}
        label={messages.budget}
        values={budgetTypes}
        warn
        readOnly={readOnly}
      />
    </Grid>
  </Grid>
);

const PartnerProfileFundingBudget = (props) => {
  const { readOnly, budgetTypes, isCountryProfile, displayType } = props;
  const isReadOnlyField = isReadOnly(isCountryProfile, displayType, readOnly);

  return (
    <FormSection name="budgets">
      <Grid container direction="column" spacing={16}>
        <Grid item>
          <ArrayForm
            fieldName={isReadOnlyField ? 'hq_budgets' : 'budgets'}
            limit={3}
            label={messages.annualBudget}
            initial
            disableAdding
            disableDeleting
            outerField={budget => annualBudgetForm(budget, budgetTypes, isReadOnlyField)}
            readOnly={readOnly}
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};

PartnerProfileFundingBudget.propTypes = {
  readOnly: PropTypes.bool,
  budgetTypes: PropTypes.array.isRequired,
  isCountryProfile: PropTypes.bool,
  displayType: PropTypes.string,
};


const connected = connect((state, ownProps) => {
  const partner = R.find(item => item.id === Number(ownProps.params.id), state.session.partners
    || state.agencyPartnersList.partners);

  return {
    isCountryProfile: partner ? partner.is_hq : false,
    displayType: partner ? partner.display_type : null,
    budgetTypes: selectNormalizedBudgets(state),
  };
}, null)(PartnerProfileFundingBudget);

export default withRouter(connected);
