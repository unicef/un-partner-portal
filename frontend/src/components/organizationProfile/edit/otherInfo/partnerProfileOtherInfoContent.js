import React from 'react';
import { FormSection } from 'redux-form';
import { FormControl, FormLabel } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import TextFieldForm from '../../../forms/textFieldForm';
import CheckboxForm from '../../../forms/checkboxForm';
import FileForm from '../../../forms/fileForm';

const labels = {
  confirm: `The Partner confirms that the information provided in the Partner 
  Profile is accurate to the best of its knowledge, and that any misrepresentations,
   falsifications, or material omissions in the Partner Profile, whenever discovered, 
   may result in disqualification from or termination of partnership with the UN.`,
};

const PartnerProfileOtherInfoContent = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="info">
      <Grid container direction="column" spacing={8}>
        <Grid item>
          <TextFieldForm
            label="Other information the organization may wish to share? (optional)"
            placeholder="200 character maximum"
            fieldName="info_to_share"
            textFieldProps={{
              inputProps: {
                maxLength: '200',
              },
            }}
            optional
            readOnly={readOnly}
          />
        </Grid>
        <Grid item>
          <FormControl fullWidth margin="normal">
            <FormLabel>{'Upload up to 3 documents that may be useful'}</FormLabel>
            <Grid item>
              <FileForm
                label="Document 1"
                placeholder="UPLOAD FILE"
                fieldName="other_documents"
                optional
              />
            </Grid>
          </FormControl>
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Organization logo"
            placeholder="UPLOAD FILE"
            fieldName="org_logo"
            optional
            warn
            readOnly={readOnly}
          />
        </Grid>
        <Grid item>
          <CheckboxForm
            label={labels.confirm}
            fieldName="confirm_data_updated"
            optional
            warn
            readOnly={readOnly}
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};

PartnerProfileOtherInfoContent.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileOtherInfoContent;
