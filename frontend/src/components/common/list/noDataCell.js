import React from 'react';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Loader from '../loader';

const styleSheet = createStyleSheet('NodataCell', () => ({
  saleAmountCell: {
    textAlign: 'right',
  },
  noDataCell: {
    textAlign: 'center',
    padding: '40px 0',
  },
}));


const NoDataCellBase = (props) => {
  const { classes, colSpan, loading } = props;
  return (<TableCell
    className={classes.noDataCell}
    colSpan={colSpan}
  >
    <big>{loading ? <Loader loading={loading} /> : 'No data'}</big>
  </TableCell>);
};

NoDataCellBase.propTypes = {
  loading: PropTypes.bool.isRequired,
  colSpan: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(NoDataCellBase);