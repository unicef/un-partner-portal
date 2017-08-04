import React, { Component } from 'react';
import InfoIcon from 'material-ui-icons/Info';
import { CardTitle } from 'material-ui/Card';
import SelectField from 'material-ui-old/SelectField';
import Grid from 'material-ui/Grid';
import { MenuItem } from 'material-ui-old/Menu';
import { withStyles, createStyleSheet } from 'material-ui/styles';


const textColor = "#9E9E9E";

const center = {
  "backgroundColor": "#EEEEEE",
  padding: "2%",
  color: textColor,
  fontSize: "0.8em",
  fontWeight: "300",
  width: "90%"
};

const linkStyle = {
  color: textColor,
  fontWeight: "bold"
}

const styles = {
  maxWidth: "90%",
};


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
}))

/**
 * This example uses an [IconButton](/#/components/icon-button) on the left, has a clickable `title`
 * through the `onTouchTap` property, and a [FlatButton](/#/components/flat-button) on the right.
 */
class OrganizationTypes extends Component {

  constructor(props) {
    super(props);
    this.state = { value: null };
    this.handleChange = this.handleChange.bind(this);
  }


  handleChange(event, index, value) { this.setState({ value }); }

  render() {
    const { classes } = this.props;
    return (
      <Grid container direction='column' xs={12} >
        <Grid item className={classes.info}>
          This portal is not intended for private sector companies, goverment ministries or agencies and individuals.&nbsp;
          <a style={linkStyle} href="http://google.com">learn more</a>
        </Grid>
        <Grid item>
          <Grid container direction='row' align='flex-end' wrap='nowrap'>
            <Grid item xs={11}>
              <SelectField
                value={this.state.value}
                floatingLabelFixed
                floatingLabelText='Type of organization'
                hintText="Select type of your organization"
                onChange={this.handleChange}
                fullWidth>
                <MenuItem value={1} primaryText="National NGO" />
                <MenuItem value={2} primaryText="International NGO (INGO)" />
              </SelectField>
            </Grid>
            <Grid item xs={1} >
              <InfoIcon className={classes.infoIcon} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
};

export default withStyles(styleSheet)(OrganizationTypes)