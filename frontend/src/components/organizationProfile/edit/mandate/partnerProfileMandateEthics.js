import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GridColumn from '../../../common/grid/gridColumn';
import { visibleIfNo, visibleIfYes, BOOL_VAL } from '../../../../helpers/formHelper';
import FileForm from '../../../forms/fileForm';
import RadioForm from '../../../forms/radioForm';
import TextFieldForm from '../../../forms/textFieldForm';
import { PLACEHOLDERS } from '../../../../helpers/constants';

const messages = {
  violationSafeguard: 'Briefly describe the organization’s mechanisms to safeguard against the violation and abuse of beneficiaries, including sexual exploitation and abuse.',
  fraudSafeguard: 'Briefly describe the organization’s mechanisms to safeguard against fraud, corruption and other unethical behaviour.',
  violation: 'Are these mechanisms formally documented in an organizational policy or code of conduct?',
  fraud: 'Are these mechanisms formally documented in an organizational policy or code of conduct?',
  commnet: 'Please comment',
  policy: 'Copy of your policy or code of conduct',
};

const PartnerProfileMandateEthics = (props) => {
  const { readOnly, ethicsSafeguard, ethicsFraud } = props;

  return (
    <FormSection name="ethics">
      <GridColumn>
        <TextFieldForm
          label={messages.violationSafeguard}
          placeholder={PLACEHOLDERS.comment}
          fieldName="ethic_safeguard_comment"
          textFieldProps={{
            multiline: true,
            InputProps: {
              inputProps: {
                maxLength: '5000',
              },
            },
          }}
          warn
          optional
          readOnly={readOnly}
        />
        <RadioForm
          fieldName="ethic_safeguard"
          label={messages.violation}
          values={BOOL_VAL}
          warn
          optional
          readOnly={readOnly}
        />
        {visibleIfYes(ethicsSafeguard)
          ? <FileForm
            formName="partnerProfile"
            sectionName="mandate_mission.ethics"
            fieldName="ethic_safeguard_policy"
            label={messages.policy}
            warn
            optional
            readOnly={readOnly}
          />
          : null}
        <TextFieldForm
          label={messages.fraudSafeguard}
          placeholder={PLACEHOLDERS.comment}
          fieldName="ethic_fraud_comment"
          textFieldProps={{
            multiline: true,
            InputProps: {
              inputProps: {
                maxLength: '5000',
              },
            },
          }}
          warn
          optional
          readOnly={readOnly}
        />
        <RadioForm
          fieldName="ethic_fraud"
          label={messages.fraud}
          values={BOOL_VAL}
          warn
          optional
          readOnly={readOnly}
        />
        {visibleIfYes(ethicsFraud)
          ? <FileForm
            formName="partnerProfile"
            sectionName="mandate_mission.ethics"
            fieldName="ethic_fraud_policy"
            label={messages.policy}
            warn
            optional
            readOnly={readOnly}
          />
          : null}
      </GridColumn>
    </FormSection>
  );
};

PartnerProfileMandateEthics.propTypes = {
  readOnly: PropTypes.bool,
  ethicsSafeguard: PropTypes.bool,
  ethicsFraud: PropTypes.bool,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    ethicsSafeguard: selector(state, 'mandate_mission.ethics.ethic_safeguard'),
    ethicsFraud: selector(state, 'mandate_mission.ethics.ethic_fraud'),
  }),
)(PartnerProfileMandateEthics);
