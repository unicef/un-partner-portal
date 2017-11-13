import React, { Component } from 'react';

import Grid from 'material-ui/Grid';

import TextFieldForm from '../forms/textFieldForm';
import PasswordFieldForm from '../forms/passwordFieldForm';
import { email, password } from '../../helpers/validation';


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
        <Grid container direction="column" spacing={16}>
          <Grid item>
            <Grid container direction="row">
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Your First Name"
                  placeholder="Provide First Name"
                  fieldName="json.user.first_name"
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Your Last Name"
                  placeholder="Provide Last Name"
                  fieldName="json.user.last_name"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Your Position/Job Title"
              fieldName="json.partner_member.title"
            />
          </Grid>
          <Grid item>
            <Grid container direction="row">
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Your E-mail Address"
                  placeholder="Provide E-mail"
                  fieldName="json.user.email"
                  validation={[email]}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <PasswordFieldForm
                  label="Password"
                  fieldName="json.user.password"
                  textFieldProps={{
                    helperText: 'Use at least 8 characters. Include at least one uppercase letter and one number.',
                  }}
                  validation={[password]}
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
