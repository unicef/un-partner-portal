import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import RadioForm from '../../../forms/radioForm';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';
import { selectNormalizedMethodAccAdopted, selectNormalizedFinancialControlSystem } from '../../../../store';
import { visibleIfYes, BOOL_VAL } from '../../../../helpers/formHelper';
import { placeholders } from '../partnerProfileEdit';

const messages = {
  accountingSystem: 'Your organization\'s accounting system',
  methodAdopted: 'What is the method of accounting adopted by the organization?',
  trackSystem: 'Does your organization have a system to track expenditures, prepare project ' +
            'reports, and prepare claims for donors?',
  systemDescription: 'Briefly explain the system used',
};

const PartnerProfileProjectImplementationFinancialControls = (props) => {
  const { readOnly, systemTrack, methodAccAdopted, financialControlSystem } = props;

  return (
    <FormSection name="financial_controls">
      <Grid container direction="column">
        <Grid item sm={6} xs={12}>
          <SelectForm
            fieldName="org_acc_system"
            label={messages.accountingSystem}
            values={financialControlSystem}
            warn
            optional
            readOnly={readOnly}
          />
        </Grid>
        <Grid item>
          <RadioForm
            fieldName="method_acc"
            label={messages.methodAdopted}
            values={methodAccAdopted}
            warn
            optional
            readOnly={readOnly}
            renderTextSelection
          />
        </Grid>
        <Grid item>
          <RadioForm
            fieldName="have_system_track"
            label={messages.trackSystem}
            values={BOOL_VAL}
            warn
            optional
            readOnly={readOnly}
          />
        </Grid>
        {visibleIfYes(systemTrack)
          ? <Grid item>
            <TextFieldForm
              label={messages.systemDescription}
              placeholder={placeholders.explain}
              fieldName="financial_control_system_desc"
              textFieldProps={{
                multiline: true,
                inputProps: {
                  maxLength: '5000',
                },
              }}
              warn
              optional
              readOnly={readOnly}
            />
          </Grid>
          : null}
      </Grid>
    </FormSection>
  );
};

PartnerProfileProjectImplementationFinancialControls.propTypes = {
  readOnly: PropTypes.bool,
  systemTrack: PropTypes.bool,
  methodAccAdopted: PropTypes.array,
  financialControlSystem: PropTypes.array,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    systemTrack: selector(state, 'project_impl.financial_controls.have_system_track'),
    methodAccAdopted: selectNormalizedMethodAccAdopted(state),
    financialControlSystem: selectNormalizedFinancialControlSystem(state),
  }),
)(PartnerProfileProjectImplementationFinancialControls);
