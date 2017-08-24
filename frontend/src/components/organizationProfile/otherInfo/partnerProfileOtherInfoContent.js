import React from 'react';
import { FormSection } from 'redux-form';
import { FormControl, FormLabel } from 'material-ui/Form';
import Grid from 'material-ui/Grid';

import TextFieldForm from '../../forms/textFieldForm';


const PartnerProfileOtherInfoContent = () => (
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
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextFieldForm
                      label="Document 2"
                      placeholder="UPLOAD FILE"
                      fieldName="orgLogo"
                      optional
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextFieldForm
                      label="Document 3"
                      placeholder="UPLOAD FILE"
                      fieldName="orgLogo"
                      optional
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
          />
        </Grid>
      </Grid>
    </Grid>
  </FormSection>
);


export default PartnerProfileOtherInfoContent;
