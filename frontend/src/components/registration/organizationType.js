import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import InfoIcon from 'material-ui-icons/Info';
import { CardTitle } from 'material-ui/Card';
import SelectField from 'material-ui-old/SelectField';
import Grid from 'material-ui/Grid';
import { MenuItem } from 'material-ui-old/Menu';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControl, FormLabel, FormControlLabel } from 'material-ui/Form';

import { renderRadioGroup, renderSelectField } from '../../lib/formHelper';


const styleSheet = createStyleSheet("OrganizationTypes", theme => ({
  info: {
    color: theme.palette.primary[500],
    background: theme.palette.primary[300],
    margin: '10px',
    fontSize: "0.8em",
    fontWeight: "300",
  },
  infoIcon: {
    fill: theme.palette.primary[500],
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  checkedRadio: {
    color: theme.palette.accent[500]
  }
}))

class OrganizationTypes extends Component {

  constructor(props) {
    super(props);
    this.state = { organization: undefined, selectedOffice: undefined };
    this.handleChange = this.handleChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
  }

  handleChange(event, value) {
    this.setState({ organization: value });
  }

  handleRadioChange(event, value) {
    this.setState({ selectedOffice: value });
  }

  render() {
    const { classes } = this.props;
    return (
      <form>
        <Grid container direction='column' xs={12} >
          <Grid item className={classes.info}>
            This portal is not intended for private sector companies, goverment ministries or agencies and individuals.&nbsp;
          <a target="_blank" href="http://unicef.com">learn more</a>
          </Grid>
          <Grid item>
            <Grid container direction='row' align='flex-end' wrap='nowrap'>
              <Grid item xs={11}>
                <Field
                  name='organizationType'
                  component={renderSelectField}
                  floatingLabelFixed
                  floatingLabelText='Type of organization'
                  hintText="Select type of your organization"
                  onChange={this.handleChange}
                  fullWidth>
                  <MenuItem value='ngo' primaryText="National NGO" />
                  <MenuItem value='ingo' primaryText="International NGO (INGO)" />
                </Field>
              </Grid>
              <Grid item xs={1} >
                <InfoIcon className={classes.infoIcon} />
              </Grid>
            </Grid>
          </Grid>
          {(this.state.organization === 'ingo')
            ? (<Grid item>
              <FormControl>
                <FormLabel>Indicate if you are</FormLabel>
                <Field name="office" component={renderRadioGroup} className={classes.formContainer}
                  selectedValue={this.state.selectedOffice}
                  onChange={this.handleRadioChange}>
                  <FormControlLabel value='hq' control={<Radio classes={{ checked: classes.checkedRadio }} />} label="Headquarters" />
                  <FormControlLabel value='country' control={<Radio classes={{ checked: classes.checkedRadio }} />} label="Country Office" />
                </Field>
              </FormControl>
            </Grid>)
            : null
          }
        </Grid>
      </form>
    )
  }
};

export default OrganizationTypes = reduxForm({
  form: 'registration',  // a unique identifier for this form
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(withStyles(styleSheet)(OrganizationTypes));
