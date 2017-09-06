import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';


function GridRow(props) {
  const { children, columns } = props;
  return (
    <Grid item >
      <Grid container direction="row" gutter={16}>
        {React.Children.map(children, child => (
          <Grid item xs={12} sm={12 / columns}>
            {child}
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

GridRow.propTypes = {
  children: PropTypes.array,
  columns: PropTypes.number.isRequired,
};

GridRow.defaultProps = {
  columns: 2,
};

export default GridRow;
