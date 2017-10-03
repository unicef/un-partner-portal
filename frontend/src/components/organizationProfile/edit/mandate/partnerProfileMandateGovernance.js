import React from 'react';
import PropTypes from 'prop-types';
import { FormSection } from 'redux-form';

import Grid from 'material-ui/Grid';
import GridColumn from '../../../common/grid/gridColumn';
import TextFieldForm from '../../../forms/textFieldForm';
import FileForm from '../../../forms/fileForm';

const messages = {
  structure: 'Briefly describe the organization\'s governance structure',
  headquaters: "Briefly describe the headquarters' oversight of country/ branch office operations including any reporting requirements of the country/branch offices to HQ.",
  organigram: 'Your most up-to-date organigram',
};

const PartnerProfileMandateGovernance = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="governance">
      <GridColumn>
        <TextFieldForm
          label={messages.structure}
          fieldName="governance_structure"
          textFieldProps={{
            inputProps: {
              maxLength: '200',
            },
          }}
          optional
          warn
          readOnly={readOnly}
        />
        <TextFieldForm
          label={messages.headquaters}
          fieldName="governance_hq"
          textFieldProps={{
            inputProps: {
              maxLength: '200',
            },
          }}
          optional
          warn
          readOnly={readOnly}
        />
        <FileForm
          label={messages.organigram}
          fieldName="governance_organigram"
          optional
          warn
          readOnly={readOnly}
        />
      </GridColumn>
    </FormSection>
  );
};

PartnerProfileMandateGovernance.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileMandateGovernance;
