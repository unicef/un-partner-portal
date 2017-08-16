import React, { Component } from 'react';

import Grid from 'material-ui/Grid';
import { FormControl, FormLabel } from 'material-ui/Form';
import Button from 'material-ui/Button';

import RadioForm from '../../forms/radioForm'
import SelectForm from '../../forms/selectForm'
import TextFieldForm from '../../forms/textFieldForm'

const PARTNER_MENU = [
  {
    value: '1',
    label: 'UNHCR'
  },
  {
    value: '2',
    label: 'UNICEF'
  },
]

const BOOL_VAL = [
  {
    value: 'yes',
    label: 'Yes'
  },
  {
    value: 'no',
    label: 'No'
  }
]

class PartnerProfileCollaborationHistory extends Component {

  constructor(props) {
    super(props);
    this.state = { organization: undefined, otherAgency: undefined };
    this.handleOrganizationFieldChange = this.handleOrganizationFieldChange.bind(this);
    this.handleOtherAgencyFieldChange = this.handleOtherAgencyFieldChange.bind(this);
  }

  handleOrganizationFieldChange(value) {
    this.setState({ organization: value });
  }

  handleOtherAgencyFieldChange(value) {
    this.setState({ otherAgency: value });
  }

  render() {
    return (
      <Grid item>
        <Grid container direction='column' gutter={16}>
          <Grid item>
            <FormControl fullWidth>
              <FormLabel>{"My Partnerships"}</FormLabel>
              <div style={{ padding: 10, backgroundColor: "lightGrey" }}>
                <Grid item>
                  <Grid container direction='column' gutter={16}>
                    <Grid item>
                      <Grid container direction='row'>
                        <Grid item sm={6} xs={12}>
                          <SelectForm
                            fieldName='organization'
                            label="Select UN agency your organization has ever collaborated with (optional)"

                            values={PARTNER_MENU}
                            onFieldChange={this.handleOrganizationFieldChange}
                            infoIcon
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <div style={{ padding: 10, backgroundColor: "grey" }}>
                    <Grid item>
                      <Grid container direction='column' gutter={16}>
                        <Grid item sm={6} xs={12}>
                          <TextFieldForm
                            label="Briefly explain the collaboration with the agency selected (optional)"
                            placeholder='200 character maximum'
                            fieldName='fundingDescription'
                            textFieldProps={{
                              inputProps: {
                                maxLength:'200'
                              }
                            }}
                          />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <TextFieldForm
                            label="Partner Number (optional)"
                            placeholder='200 character maximum'
                            fieldName='fundingDescription'
                            textFieldProps={{
                              inputProps: {
                                maxLength:'200'
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item>
                  <Button
                    href="https://github.com/callemall/material-ui"
                    target="_blank"
                    label="GitHub Link"
                    secondary={true}
                  >
                    + Add new
                  </Button>
                </Grid>
              </div>
            </FormControl>
          </Grid>
          <Grid>
            <SelectForm
              fieldName='otherAgency'
              label='Please indicate if you have collaborated with any other UN Agency (optional)'
              values={PARTNER_MENU}
              onFieldChange={this.handleOtherAgencyFieldChange}
              selectFieldProps={{
                              multiple: true
                            }}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <RadioForm
              fieldName='hasFraudSafeguard'
              label='Has the organization collaborated with a member of a cluster, professional network, consortium or any similar institution?'
              values={BOOL_VAL}
              onFieldChange={this.handleOtherAgencyFieldChange}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Please state which cluster, network or consortium and briefly explain the collaboration"
              placeholder=''
              fieldName='fraudSafeguardComment'
              textFieldProps={{
                inputProps: {
                  maxLength:'200'
                }
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    )
  }
};

export default PartnerProfileCollaborationHistory;