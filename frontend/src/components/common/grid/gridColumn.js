import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';

function GridColumn(props) {
  const { children, spacing, removeNullChildren } = props;
  return (
    <Grid container direction="column" spacing={spacing}>
      {React.Children.map(children, child =>
        (removeNullChildren && !child
          ? null
          : <Grid item >
            {child}
          </Grid>))}
    </Grid>
  );
}

GridColumn.propTypes = {
  children: PropTypes.array,
  spacing: PropTypes.number,
  removeNullChildren: PropTypes.bool,
};

GridColumn.defaultProps = {
  spacing: 16,
  removeNullChildren: false,
};

export default GridColumn;
