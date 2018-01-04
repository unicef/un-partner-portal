import React from 'react';
import PropTypes from 'prop-types';
import { FormSection } from 'redux-form';
import TextFieldForm from '../../../forms/textFieldForm';
import GridColumn from '../../../common/grid/gridColumn';
import { placeholders } from '../partnerProfileEdit';

const messages = {
  rationale: 'Briefly state the background and rationale for the establishment of the ' +
            'organization',
  mandate: 'Briefly state the mandate and mission of the organization',
};

const PartnerProfileMandateBackground = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="background">
      <GridColumn>
        <TextFieldForm
          label={messages.rationale}
          fieldName="background_and_rationale"
          textFieldProps={{
            inputProps: {
              maxLength: '400',
            },
          }}
          placeholder={placeholders.state}
          warn
          optional
          readOnly={readOnly}
        />
        <TextFieldForm
          label={messages.mandate}
          fieldName="mandate_and_mission"
          placeholder={placeholders.state}
          textFieldProps={{
            inputProps: {
              maxLength: '400',
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


PartnerProfileMandateBackground.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileMandateBackground;
