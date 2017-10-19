import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';

function GridColumn(props) {
  const { children, spacing, ...other } = props;
  return (
    <Grid container direction="column" spacing={spacing} {...other}>
      {React.Children.map(children, child =>
        (child
          ? <Grid item >
            {child}
          </Grid>
          : null))}
    </Grid>
  );
}

GridColumn.propTypes = {
  children: PropTypes.array,
  spacing: PropTypes.number,
};

GridColumn.defaultProps = {
  spacing: 16,
};

export default GridColumn;
