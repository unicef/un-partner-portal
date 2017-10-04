import React from 'react';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArrayForm from '../../../forms/arrayForm';
import SelectForm from '../../../forms/selectForm';
import NumberFieldForm from '../../../forms/numberFieldForm';
import { selectNormalizedBudgets } from '../../../../store';

const messages = {
  annualBudget: 'What is your organization\'s annual budget (in USD) for the current and two previous fiscal years?',
  budget: 'Budget',
  year: 'Year',
};

const annualBudgetForm = (budget, budgetTypes, readOnly) => (
  <Grid container direction="row">
    <Grid item sm={5} xs={12} >
      <NumberFieldForm
        fieldName={`${budget}.year`}
        label={messages.year}
        textFieldProps={{
          inputProps: {
            type: 'number',
            min: 1900,
            max: (new Date()).getFullYear(),
          },
        }}
        optional
        warn
        readOnly={readOnly}
      />
    </Grid>
    <Grid item sm={7} xs={12} >
      <SelectForm
        fieldName={`${budget}.budget`}
        label={messages.budget}
        values={budgetTypes}
        optional
        warn
        readOnly={readOnly}
      />
    </Grid>
  </Grid>
);

const PartnerProfileFundingBudget = (props) => {
  const { readOnly, budgetTypes } = props;

  return (
    <FormSection name="budgets">
      <Grid container direction="column" spacing={16}>
        <Grid item>
          <ArrayForm
            fieldName="budgets"
            limit={3}
            label={messages.annualBudget}
            initial
            initialCount={3}
            disableAdding
            disableDeleting
            outerField={budget => annualBudgetForm(budget, budgetTypes, readOnly)}
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
};

export default connect(state => ({
  budgetTypes: selectNormalizedBudgets(state),
}))(PartnerProfileFundingBudget);
