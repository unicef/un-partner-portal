import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GridColumn from '../../../common/grid/gridColumn';
import { visibleIfNo, visibleIfYes, BOOL_VAL } from '../../../../helpers/formHelper';
import FileForm from '../../../forms/fileForm';
import RadioForm from '../../../forms/radioForm';
import TextFieldForm from '../../../forms/textFieldForm';

const messages = {
  violation: 'Does the organization have a policy or code of conduct to safegaurd ' +
                'against the violation and abuse of beneficiaries?',
  fraud: 'Does the organization have a policy or code of conduct to safegaurd ' +
                'against fraud and corruption?',
  commnet: 'Please comment',
  policy: 'Copy of your policy or code of conduct',
};

const PartnerProfileMandateEthics = (props) => {
  const { readOnly, ethicsSafeguard, ethicsFraud } = props;

  return (
    <FormSection name="ethics">
      <GridColumn removeNullChildren>
        <RadioForm
          fieldName="ethic_safeguard"
          label={messages.violation}
          values={BOOL_VAL}
          optional
          warn
          readOnly={readOnly}
        />
        {visibleIfNo(ethicsSafeguard)
          ? <TextFieldForm
            label={messages.commnet}
            placeholder=""
            fieldName="ethic_safeguard_comment"
            textFieldProps={{
              inputProps: {
                maxLength: '200',
              },
            }}
            optional
            warn
            readOnly={readOnly}
          />
          : null}
        {visibleIfYes(ethicsSafeguard)
          ? <FileForm
            fieldName="ethic_safeguard_policy"
            label={messages.policy}
            optional
            warn
            readOnly={readOnly}
          />
          : null}
        <RadioForm
          fieldName="ethic_fraud"
          label={messages.fraud}
          values={BOOL_VAL}
          optional
          warn
          readOnly={readOnly}
        />
        {visibleIfNo(ethicsFraud)
          ? <TextFieldForm
            label={messages.commnet}
            placeholder=""
            fieldName="ethic_fraud_comment"
            textFieldProps={{
              inputProps: {
                maxLength: '200',
              },
            }}
            optional
            warn
            readOnly={readOnly}
          />
          : null}
        {visibleIfYes(ethicsFraud)
          ? <FileForm
            fieldName="ethic_fraud_policy"
            label={messages.policy}
            optional
            warn
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
