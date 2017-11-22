import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import SvgIcon from 'material-ui/SvgIcon';
import { applicationStatuses } from '../../../../helpers/idMaps';


const styleSheet = theme => ({
  Pen: {
    color: theme.palette.eoiStatus.open,
  },
  Rej: {
    color: theme.palette.eoiStatus.closed,
  },
  Pre: {
    color: theme.palette.eoiStatus.completed,
  },
  text: {
    whiteSpace: 'normal',
    maxWidth: 80,
  },
});

const ApplicationStatusText = (props) => {
  const { classes, status } = props;
  const colorClass = classNames(classes[status]);
  return (
    <Grid container direction="row" alignItems="center" wrap="nowrap" spacing={8}>
      <Grid item >
        <SvgIcon className={colorClass}>
          <circle cx="12" cy="12" r="8" />
        </SvgIcon>
      </Grid>
      <Grid item className={classes.text}>
        <Typography type="body1" color="inherit">
          {applicationStatuses[status]}
        </Typography>
      </Grid>
    </Grid>
  );
};

ApplicationStatusText.propTypes = {
  classes: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
};

export default withStyles(styleSheet, { name: 'ApplicationStatusText' })(ApplicationStatusText);
