import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles, createStyleSheet } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import SvgIcon from 'material-ui/SvgIcon';

const STATUSES = {
  Ope: 'Open',
  Clo: 'Closed/Under Review',
  Com: 'Completed',
};

const styleSheet = createStyleSheet('EoiStatusCell', theme => ({
  Ope: {
    color: theme.palette.eoiStatus.open,
  },
  Clo: {
    color: theme.palette.eoiStatus.closed,
  },
  Com: {
    color: theme.palette.eoiStatus.completed,
  },
  mainText: {
    color: theme.palette.grey[300],
    fontWeight: 400,
    fontSize: 12,
    padding: '4px 8px',
  },
  text: {
    whiteSpace: 'normal',
    maxWidth: 80,
  },
}));


const EoiStatusCell = (props) => {
  const { classes, id } = props;
  const colorClass = classNames(classes[id]);
  return (
    <Grid container direction="row" align="center" wrap="nowrap" spacing={8}>
      <Grid item >
        <SvgIcon className={colorClass}>
          <circle cx="12" cy="12" r="8" />
        </SvgIcon>
      </Grid>
      <Grid item className={classes.text}>
        {STATUSES[id]}
      </Grid>
    </Grid>
  );
};

EoiStatusCell.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

export default withStyles(styleSheet)(EoiStatusCell);
