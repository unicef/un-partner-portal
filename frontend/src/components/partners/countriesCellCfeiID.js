import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';

import { TableCell } from 'material-ui/Table';
import EoiCountryCell from '../eois/cells/eoiCountryCell';
import { withStyles } from 'material-ui/styles';
import Tooltip from '../common/portalTooltip';
import Typography from 'material-ui/Typography';

const styleSheet = (theme) => ({
  mainText: {
    color: theme.palette.grey[300],
    fontSize: 12,
    padding: '4px 8px',
  },
});

const CountriesCellCfeiId = (props) => {
  const { classes, countries, cfeiID } = props;

  return (
    <TableCell>
      <Tooltip
        id={cfeiID}
        title={<div className={classes.mainText}>{cfeiID}</div>}
      >
        <div>
          {countries && countries.map(item =>
            (<div key={item}><EoiCountryCell code={item} />{R.last(countries) !== item ? ', ' : null}</div>))}
        </div>
      </Tooltip>
    </TableCell>
  );
};

CountriesCellCfeiId.propTypes = {
  classes: PropTypes.object,
  countries: PropTypes.array,
  cfeiID: PropTypes.string,
};

export default withStyles(styleSheet, { name: 'CountriesCellCfeiId' })(CountriesCellCfeiId);
