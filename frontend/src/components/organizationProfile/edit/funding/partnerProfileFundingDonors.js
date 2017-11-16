import React from 'react';
import { FormSection } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GridColumn from '../../../common/grid/gridColumn';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';
import { selectNormalizedPartnerDonors } from '../../../../store';

const messages = {
  typeOfDonor: 'Please select the type of donors that fund your agency',
  donorsList: 'Please list your main donors for programme activities',
  coreFunding: 'Please list your main donors for core funding',
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
          selectFieldProps={{
            multiple: true,
          }}
          optional
          warn
          readOnly={readOnly}
        />
        <TextFieldForm
          label={messages.donorsList}
          fieldName="main_donors_list"
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
        <TextFieldForm
          label={messages.coreFunding}
          fieldName="source_core_funding"
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

PartnerProfileFundingDonors.propTypes = {
  readOnly: PropTypes.bool,
  partnerDonors: PropTypes.array.isRequired,
};

export default connect(
  state => ({
    partnerDonors: selectNormalizedPartnerDonors(state),
  }))(PartnerProfileFundingDonors);
