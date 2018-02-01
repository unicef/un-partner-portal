import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

/** Custom grid column based on flexbox 
 * - used instead of materia-ui one to avoid strange spacing
 * issues when multiple grid columns being nested in each other
 * currently supports only one spacing - 12px
 * */

const styleSheet = (theme) => ({
  grid: {
    display: 'flex',
    flexDirection: 'column',
    margin: -(theme.spacing.unit * 1.5),
  },
  gridItem: {
    padding: theme.spacing.unit * 1.5,
  },
});

function CustomGridColumn(props) {
  const { classes, children, spacing, ...other } = props;
  return (
    <div className={classes.grid} >
      {React.Children.map(children, child =>
        (child
          ? <div className={classes.gridItem} >
            {child}
          </div>
          : null))}
    </div>
  );
}

CustomGridColumn.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
};

;

export default withStyles(styleSheet, { name: 'CustomGridColumn'})(CustomGridColumn);
