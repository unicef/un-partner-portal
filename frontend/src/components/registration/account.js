import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import TextFieldForm from '../forms/textFieldForm';
import PasswordFieldForm from '../forms/passwordFieldForm';
import { email, password } from '../../helpers/validation';

const messages = {
  emailInfo: 'The e-mail address and password provided above will be required for you to log in to the UN Partner Portal.',
};


const styleSheet = theme => ({
  infoBox: {
    marginTop: `${theme.spacing.unit * 2}px`,
    padding: `${theme.spacing.unit}px`,
    background: theme.palette.common.gray,
  },
  info: {
    color: theme.palette.common.grayText,
  },
});

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
    const { classes } = this.props;

    return (
      <Grid item>
        <Grid container direction="column" spacing={16}>
          <Grid item>
            <TextFieldForm
              label="Your Full Name"
              placeholder="Provide Full Name"
              fieldName="json.user.fullname"
            />
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
                  textFieldProps={{
                    "type": "email"
                  }}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <PasswordFieldForm
                  label="Password"
                  fieldName="json.user.password"
                  textFieldProps={{
                    helperText: 'Use at least 8 characters. Include at least one lowercase ' +
                    'letter, one uppercase letter and one number.',
                  }}
                  validation={[password]}
                />
              </Grid>
            </Grid>
            <Grid item>
              <div className={classes.infoBox}> <Typography className={classes.info} type="body1">{messages.emailInfo}</Typography></div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default (withStyles(styleSheet, { name: 'Account' })(Account));
