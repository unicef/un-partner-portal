import React from 'react';
import { FormSection } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GridColumn from '../../../common/grid/gridColumn';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';
import { selectNormalizedPartnerDonors } from '../../../../store';
import { PLACEHOLDERS } from '../../../../helpers/constants';

const messages = {
  typeOfDonor: 'Please select the type of donors that fund your agency',
  donorsList: 'Please list your main donors for programme activities',
  coreFunding: 'Please list your main donors for core funding',
  coreFundingTooltip: 'Core funding: refers to financial support that covers an organization’s ' +
  'basic "core" organizational and administrative costs, including salaries of non-project staff, ' +
  'rent, equipment, utilities and communications.',
};

const PartnerProfileFundingDonors = (props) => {
  const { readOnly, partnerDonors } = props;

  return (
    <FormSection name="major_donors">
      <GridColumn>
        <SelectForm
          fieldName="major_donors"
          label={messages.typeOfDonor}
          values={partnerDonors}
          multiple
          placeholder={PLACEHOLDERS.select}
          warn
          optional
          readOnly={readOnly}
        />
        <TextFieldForm
          label={messages.donorsList}
          fieldName="main_donors_list"
          placeholder={PLACEHOLDERS.list}
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
        <TextFieldForm
          label={messages.coreFunding}
          placeholder={PLACEHOLDERS.list}
          fieldName="source_core_funding"
          infoText={messages.coreFundingTooltip}
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
      </GridColumn>
    </FormSection>
  );
};

PartnerProfileFundingDonors.propTypes = {
  readOnly: PropTypes.bool,
  partnerDonors: PropTypes.array.isRequired,
};

export default connect(
  state => ({
    partnerDonors: selectNormalizedPartnerDonors(state),
  }))(PartnerProfileFundingDonors);
