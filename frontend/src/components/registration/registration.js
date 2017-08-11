import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { CardHeader } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import Stepper from './stepper';

const styleSheet = createStyleSheet('registration', theme => ({
  container: {
    // position: 'absolute',
    // height: '100%'

  },
  header: {
    color: theme.palette.primary[400],
    // should be #6B5CA5
    backgroundColor: theme.palette.accent[500],
    marginBottom: '1em',
  },

}));
/**
 * This example uses an [IconButton](/#/components/icon-button) on the left, has a clickable `title`
 * through the `onTouchTap` property, and a [FlatButton](/#/components/flat-button) on the right.
 */
const registration = (props) => {
  const { classes } = props;
  return (
    <Grid container className={classes.container} justify="center" align="center">
      <Grid item xs={12} md={5} >
        <CardHeader
          className={classes.header}
          classes={{ content: classes.title }}
          title="Registration"
        />
        <Paper elevation={2} >
          <Stepper />
        </Paper>
      </Grid>
    </Grid>
  );
};

registration.contextTypes = { muiTheme: PropTypes.object.isRequired };


export default withStyles(styleSheet)(registration);
