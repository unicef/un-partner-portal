import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

const messages = {
  clear: 'clear',
};

const styleSheet = createStyleSheet('TableFilter', theme => ({
  filterContainer: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
    background: theme.palette.primary[300],
  },
}));

const handleSubmit = (values) => {

}

const TableFilter = (props) => {
  const { handleSubmit, reset, children, classes } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Grid item>
        <Grid container direction="column" xs={12} className={classes.filterContainer} >
          {React.Children.map(children, child =>
            React.cloneElement(child, { reset }),
          )}
          <Grid item>
            <Button
              color="accent"
              onTouchTap={reset}
            >
              {messages.clear}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form >
  );
};

TableFilter.propTypes = {
  /**
   * callback for 'next' button
   */
  handleSubmit: PropTypes.func.isRequired,
  /**
   * component to be wrapped
   */
  children: PropTypes.node.isRequired,
  /**
   * callback for 'back' button
   */
  reset: PropTypes.func.isRequired,
};

const formTableFilter = reduxForm({
  form: 'tableFilter',
  handleSubmit,
})(TableFilter);

export default withStyles(styleSheet)(formTableFilter);