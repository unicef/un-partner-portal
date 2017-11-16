import React from 'react';
import { FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import GridColumn from '../../../common/grid/gridColumn';
import { BOOL_VAL } from '../../../../helpers/formHelper';
import RadioForm from '../../../forms/radioForm';
import TextFieldForm from '../../../forms/textFieldForm';

const messages = {
  highRiskLoaction: 'Does the organization have the ablility to work in high-risk securit locations?',
  highRiskPolicy: 'Does the organization have policies, procedures and practices related to security risk management?',
  description: 'Briefly describe the organization\'s ability, if any, to scale-up operations in emergencies or other situations requiring rapid response.',
};

const PartnerProfileMandateSecurity = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="security">
      <GridColumn>
        <Grid container direction="row">
          <Grid item sm={6} xs={12}>
            <RadioForm
              fieldName="security_high_risk_locations"
              label={messages.highRiskLoaction}
              values={BOOL_VAL}
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <RadioForm
              fieldName="security_high_risk_policy"
              label={messages.highRiskPolicy}
              values={BOOL_VAL}
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
        </Grid>
        <TextFieldForm
          label={messages.description}
          fieldName="security_desc"
          textFieldProps={{
            multiline: true,
            inputProps: {
              maxLength: '5000',
            },
          }}
          optional
          warn
          readOnly={readOnly}
        />
      </GridColumn>
    </FormSection>
  );
};

PartnerProfileMandateSecurity.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileMandateSecurity;
