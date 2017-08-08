import React, { Component } from 'react';
import { Field } from 'redux-form'
import { withStyles, createStyleSheet } from 'material-ui/styles';
import InfoIcon from 'material-ui-icons/Info';
import { CardTitle } from 'material-ui/Card';
import SelectField from 'material-ui-old/SelectField';
import Grid from 'material-ui/Grid';
import { MenuItem } from 'material-ui-old/Menu';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControl, FormLabel, FormControlLabel } from 'material-ui/Form';
import Button from 'material-ui/Button';
import {
  renderRadioGroup,
  renderSelectField,
  renderFormControl,
  renderTextField
} from '../../lib/formHelper';
import RadioForm from '../forms/radioForm'
import SelectForm from '../forms/selectForm'
import TextFieldForm from '../forms/textFieldForm'

const styleSheet = createStyleSheet("BasicInformation", theme => ({
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

const NAME_CHANGE = [
  {
    value: 'yes',
    label: 'Yes'
  },
  {
    value: 'no',
    label: 'No'
  }
]

const COUNTRY_MENU = [
  {
    value: 'fr',
    label: 'France'
  },
  {
    value: 'it',
    label: 'Italy'
  }
]

class BasicInformation extends Component {

  constructor(props) {
    super(props);
    this.state = { organization: undefined, selectedOffice: undefined };
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleFieldChange(value) {
    this.setState({ organization: value });
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid item>
        <Grid container direction='column' gutter={16}>
          <TextFieldForm
            label="Organization's Legal Name"
            fieldName='legalName'
          />
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Alias (optional)"
              fieldName='legalNameAlias'
            />
          </Grid>
          <RadioForm
            fieldName='legalNameChange'
            label='Has the Organization had a legal name change?'
            values={NAME_CHANGE}
            onFieldChange={this.handleFieldChange}
          />
          <SelectForm
            fieldName='country'
            label='Country of Origin'
            values={COUNTRY_MENU}
            infoIcon
          />
        </Grid>
      </Grid>

    )
  }
};

export default withStyles(styleSheet)(BasicInformation);
