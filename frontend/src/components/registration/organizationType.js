import React, { Component } from 'react';
import Warning from 'material-ui-icons/Warning';
import { CardTitle } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import { MenuItem } from 'material-ui/Menu';



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




/**
 * This example uses an [IconButton](/#/components/icon-button) on the left, has a clickable `title`
 * through the `onTouchTap` property, and a [FlatButton](/#/components/flat-button) on the right.
 */
class OrganizationTypes extends Component {

  constructor(props) {
    super(props);
    this.state = { value: null };
  }


  handleChange(event, index, value) { this.setState({ value }); }

  render() {
    return (
      <div>
        <div>
          This portal is not intended for private sector companies, goverment ministries or agencies and individuals.&nbsp;
          <a style={linkStyle} href="http://google.com">learn more</a>
        </div>
        <div >
          <p> Type of organization</p>
          <Grid container direction='row'>
            <TextField
              value={this.state.value}
      
              hintText="Select type of your organization">
              <MenuItem value={1} primaryText="National NGO" />
              <MenuItem value={2} primaryText="International NGO (INGO)" />
            </TextField>
            <Warning />
          </Grid>
        </div>
      </div>
    )
  }
};

export default OrganizationTypes