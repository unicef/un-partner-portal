import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';


function GridRow(props) {
  const { children, columns, gutter, ...other } = props;
  return (
    <Grid item >
      <Grid container direction="row" gutter={gutter} {...other}>
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
  gutter: PropTypes.number,
};

GridRow.defaultProps = {
  columns: 2,
  gutter: 16,
};

export default GridRow;
