import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import Stepper from '../registration/stepper';

const styleSheet = createStyleSheet('partnerProfileIdentification', theme => ({
  container: {
    position: 'absolute',
    height: '100%'

  },
  header: {
    "color": theme.palette.primary[400],
    //should be #6B5CA5
    "backgroundColor": theme.palette.accent[500],
    "marginBottom": "1em"
  },

}))
/**
 * This example uses an [IconButton](/#/components/icon-button) on the left, has a clickable `title`
 * through the `onTouchTap` property, and a [FlatButton](/#/components/flat-button) on the right.
 */
class partnerProfileIdentification extends Component {
  state = {
    stepIndex: 0,
  };

  handleNext = () => {
    const {stepIndex} = this.state;
    if (stepIndex < 2) {
      this.setState({stepIndex: stepIndex + 1});
    }
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  render() {
    const classes = this.props.classes;
    return (
      <Grid container className={classes.container} justify='center' align='center'>
        <Grid item xs={12} md={5} >
        {'Item one'}
          <CardHeader className={classes.header} classes={{ content: classes.title }}
            title="Collaboration" />
          <Paper elevation={2} >
              <Stepper />  
          </Paper>
        </Grid>
      </Grid>
    )
  }
};

  partnerProfileIdentification.contextTypes = {muiTheme: PropTypes.object.isRequired};

partnerProfileIdentification.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(partnerProfileIdentification);