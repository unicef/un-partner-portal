import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';


function GridRow(props) {
  const { children, columns, spacing, ...other } = props;
  return (
    <Grid container direction="row" spacing={spacing} {...other}>
      {React.Children.map(children, child => (
        <Grid item xs={12} sm={12 / columns}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
}

GridRow.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  columns: PropTypes.number.isRequired,
  spacing: PropTypes.number,
};

GridRow.defaultProps = {
  columns: 2,
  spacing: 24,
};

export default GridRow;
