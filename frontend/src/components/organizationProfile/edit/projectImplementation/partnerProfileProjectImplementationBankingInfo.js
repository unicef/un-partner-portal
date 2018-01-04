import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RadioForm from '../../../forms/radioForm';
import TextFieldForm from '../../../forms/textFieldForm';
import { visibleIfNo, BOOL_VAL } from '../../../../helpers/formHelper';
import GridColumn from '../../../common/grid/gridColumn';
import { placeholders } from '../partnerProfileEdit';

const messages = {
  hasBankAccount: 'Does the organization have a bank account?',
  hasSeparateAccount: 'Does the organization currently maintain, or has it previously maintained, ' +
            'a separate interest-bearing account for UN funded projects that require a separate ' +
            'account?',
  explain: 'Briefly explain the system used',
};

const PartnerProfileProjectImplementationBankingInfo = (props) => {
  const { readOnly, haveSeparateBankAccount } = props;

  return (
    <FormSection name="banking_information">
      <GridColumn>
        <RadioForm
          fieldName={'have_bank_account'}
          label={messages.hasBankAccount}
          values={BOOL_VAL}
          warn
          optional
          readOnly={readOnly}
        />
        <RadioForm
          fieldName={'have_separate_bank_account'}
          label={messages.hasSeparateAccount}
          values={BOOL_VAL}
          warn
          optional
          readOnly={readOnly}
        />
        {visibleIfNo(haveSeparateBankAccount)
          ? <TextFieldForm
            label={messages.explain}
            fieldName="explain"
            placeholder={placeholders.explain}
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
          : null}
      </GridColumn>
    </FormSection>
  );
};

PartnerProfileProjectImplementationBankingInfo.propTypes = {
  readOnly: PropTypes.bool,
  haveSeparateBankAccount: PropTypes.bool,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    haveSeparateBankAccount: selector(state, 'project_impl.banking_information.have_separate_bank_account'),
  }),
)(PartnerProfileProjectImplementationBankingInfo);
