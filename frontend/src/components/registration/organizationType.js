import React, { Component } from 'react';

import { withStyles, createStyleSheet } from 'material-ui/styles';

import Grid from 'material-ui/Grid';

import RadioForm from '../forms/radioForm'
import SelectForm from '../forms/selectForm'


const styleSheet = createStyleSheet("OrganizationTypes", theme => ({
  info: {
    color: theme.palette.primary[500],
    background: theme.palette.primary[300],
    padding: '10px',
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

const RADIO_VALUES = [
  {
    value: 'hq',
    label: 'Headquarters'
  },
  {
    value: 'country',
    label: 'Country Office'
  },
]

const MENU_VALUES = [
  {
    value: 'ngo',
    label: 'National NGO'
  },
  {
    value: 'ingo',
    label: 'International NGO (INGO)'
  },
]


class OrganizationTypes extends Component {

  constructor(props) {
    super(props);
    this.state = { organization: undefined };
    this.handleFieldChange = this.handleFieldChange.bind(this);

  }

  handleFieldChange(value) {
    this.setState({ organization: value });
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid item>
        <Grid item>
          <div className={classes.info}>
            This portal is not intended for private sector companies, goverment ministries or agencies and individuals.&nbsp;
            <a target="_blank" href="http://unicef.com" rel="noopener noreferrer">learn more</a>
          </div>
        </Grid>
        <SelectForm
          fieldName='organizationType'
          label='Type of organization'
          values={MENU_VALUES}
          onFieldChange={this.handleFieldChange}
          infoIcon
        />
        {this.state.organization === 'ingo' && (
          <RadioForm
            fieldName='office'
            label='Indicate if you are'
            values={RADIO_VALUES}
          />
        )}
      </Grid>
    )
  }
}

export default withStyles(styleSheet)(OrganizationTypes);
