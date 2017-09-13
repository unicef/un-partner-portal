import React from 'react';
import { FormSection } from 'redux-form';
import { FormControl, FormLabel } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import TextFieldForm from '../../../forms/textFieldForm';


const PartnerProfileOtherInfoContent = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="content">
      <Grid item>
        <Grid container direction="column" gutter={8}>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Other information the organization may wish to share? (optional)"
              placeholder="200 character maximum"
              fieldName="otherInformation"
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
              <div style={{ padding: 20, backgroundColor: 'lightGrey' }}>
                <Grid item>
                  <Grid container direction="column" gutter={16}>
                    <Grid item sm={6} xs={12}>
                      <TextFieldForm
                        label="Document 1"
                        placeholder="UPLOAD FILE"
                        fieldName="orgLogo"
                        optional
                        readOnly={readOnly}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextFieldForm
                        label="Document 2"
                        placeholder="UPLOAD FILE"
                        fieldName="orgLogo"
                        optional
                        readOnly={readOnly}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextFieldForm
                        label="Document 3"
                        placeholder="UPLOAD FILE"
                        fieldName="orgLogo"
                        optional
                        readOnly={readOnly}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </FormControl>
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Organization logo"
              placeholder="UPLOAD FILE"
              fieldName="orgLogo"
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
        </Grid>
      </Grid>
    </FormSection>
  );
};

PartnerProfileOtherInfoContent.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileOtherInfoContent;
