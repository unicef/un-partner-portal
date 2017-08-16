import React, { Component } from 'react';

import { FormControl, FormLabel } from 'material-ui/Form';
import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm'
import SelectForm from '../../forms/selectForm'
import TextFieldForm from '../../forms/textFieldForm'

const DONORS_MENU = [
  {
    value: '1',
    label: 'Individuals'
  },
  {
    value: '2',
    label: 'United Nations Agency'
  },
  {
    value: '3',
    label: 'Governments'
  }
]

class PartnerProfileOtherInfoContent extends Component {

  constructor(props) {
    super(props);
    this.state = { donors: undefined };
    this.handleDonorFieldChange = this.handleDonorFieldChange.bind(this);
  }

  handleDonorFieldChange(value) {
    this.setState({ donors: value });
  }

  render() {
    return (
      <Grid item>
        <Grid container direction='column' gutter={16} spacing={8}>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Other information the organization may wish to share? (optional)"
              placeholder='200 character maximum'
              fieldName='otherInformation'
              textFieldProps={{
                inputProps: {
                  maxLength:'200'
                }
              }}
            />
          </Grid>
          <Grid item>
            <FormControl fullWidth margin='normal'>
              <FormLabel>{"Upload up to 3 documents that may be useful"}</FormLabel>
              <div style={{ padding: 20, backgroundColor: "lightGrey" }}>
                <Grid item>
                  <Grid container direction='column' gutter={16}>
                    <Grid item sm={6} xs={12}>
                      <TextFieldForm
                        label="Document 1"
                        placeholder='UPLOAD FILE'
                        fieldName='orgLogo'
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextFieldForm
                        label="Document 2"
                        placeholder='UPLOAD FILE'
                        fieldName='orgLogo'
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextFieldForm
                        label="Document 3"
                        placeholder='UPLOAD FILE'
                        fieldName='orgLogo'
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
              placeholder='UPLOAD FILE'
              fieldName='orgLogo'
            />
          </Grid>
        </Grid>
      </Grid>
    )
  }
};

export default PartnerProfileOtherInfoContent;