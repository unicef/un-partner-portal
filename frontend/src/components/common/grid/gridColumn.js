import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';


function GridRow(props) {
  const { children } = props;
  return (
    <Grid item >
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

GridRow.propTypes = {
  children: PropTypes.array,

};

export default GridRow;
