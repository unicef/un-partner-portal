import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import Stepper from '../registration/stepper';

const styleSheet = createStyleSheet('partnerProfileProjectImplementation', theme => ({
  container: {
    // position: 'absolute',
    // height: '100%'

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
const partnerProfileProjectImplementation = (props, context) => {

  const { classes } = props;
  return (
    <Grid container className={classes.container} justify='center' align='center'>
      <Grid item xs={12} md={5} >
        <CardHeader className={classes.header} classes={{ content: classes.title }}
          title="Collaboration" />
        <Paper elevation={2} >
            <Stepper />  
        </Paper>
      </Grid>
    </Grid>
  )
};

  partnerProfileProjectImplementation.contextTypes = {muiTheme: PropTypes.object.isRequired};

partnerProfileProjectImplementation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(partnerProfileProjectImplementation);