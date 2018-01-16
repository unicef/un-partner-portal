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
  violation: 'Does the organization have a policy or code of conduct to safeguard ' +
                'against the violation and abuse of beneficiaries?',
  fraud: 'Does the organization have a policy or code of conduct to safeguard ' +
                'against fraud and corruption?',
  commnet: 'Please comment',
  policy: 'Copy of your policy or code of conduct',
};

const PartnerProfileMandateEthics = (props) => {
  const { readOnly, ethicsSafeguard, ethicsFraud } = props;

  return (
    <FormSection name="ethics">
      <GridColumn>
        <RadioForm
          fieldName="ethic_safeguard"
          label={messages.violation}
          values={BOOL_VAL}
          warn
          optional
          readOnly={readOnly}
        />
        {visibleIfNo(ethicsSafeguard)
          ? <TextFieldForm
            label={messages.commnet}
            placeholder={PLACEHOLDERS.comment}
            fieldName="ethic_safeguard_comment"
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
          : null}
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
        <RadioForm
          fieldName="ethic_fraud"
          label={messages.fraud}
          values={BOOL_VAL}
          warn
          optional
          readOnly={readOnly}
        />
        {visibleIfNo(ethicsFraud)
          ? <TextFieldForm
            label={messages.commnet}
            placeholder={PLACEHOLDERS.comment}
            fieldName="ethic_fraud_comment"
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
          : null}
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
