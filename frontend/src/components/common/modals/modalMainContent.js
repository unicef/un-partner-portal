import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import Grid from 'material-ui/Grid';


const styleSheet = createStyleSheet('ModalMainContent', theme => ({
  root: {
    padding: theme.spacing.unit * 3,
  },
}));

function ModalMainContent(props) {
  const { classes, children } = props;
  return (
    <Grid className={classes.root} item >
      <Grid container direction="column" gutter={16}>
        {React.Children.map(children, child => (
          <Grid item>
            {child}
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

ModalMainContent.propTypes = {
  /**
   * Trigger, show dialog when true
   */
  children: PropTypes.array,
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(ModalMainContent);
