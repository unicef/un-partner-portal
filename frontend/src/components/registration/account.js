import React, { Component } from 'react';

import Grid from 'material-ui/Grid';

import TextFieldForm from '../forms/textFieldForm';
import PasswordFieldForm from '../forms/passwordFieldForm';
import { email } from '../../helpers/validation';


class Account extends Component {
  constructor(props) {
    super(props);
    this.state = { legalNameChange: undefined };
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleFieldChange(value) {
    this.setState({ legalNameChange: value });
  }

  render() {
    return (
      <Grid item>
        <Grid container direction="column" gutter={16}>
          <Grid item>
            <Grid container direction="row">
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Your First Name"
                  placeholder="Provide First Name"
                  fieldName="userFirstName"
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Your Last Name"
                  placeholder="Provide Last Name"
                  fieldName="userLastName"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Your Position/Job Title"
              fieldName="userPosition"
            />
          </Grid>
          <Grid item>
            <Grid container direction="row">
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="E-mail address"
                  placeholder="Provide E-mail"
                  fieldName="userEmail"
                  validation={[email]}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <PasswordFieldForm
                  label="Password"
                  fieldName="userPassword"
                  textFieldProps={{
                    helperText: 'Use at least 8 characters, include both an uppercase, letter and a number.',
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default Account;
