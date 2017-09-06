import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';


function GridColumn(props) {
  const { children, gutter } = props;
  return (
    <Grid item >
      <Grid container direction="column" gutter={gutter}>
        {React.Children.map(children, child => (
          <Grid item>
            {child}
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

GridColumn.propTypes = {
  children: PropTypes.array,
  gutter: PropTypes.number,
};

GridColumn.defaultProps = {
  gutter: 16,
};

export default GridColumn;
