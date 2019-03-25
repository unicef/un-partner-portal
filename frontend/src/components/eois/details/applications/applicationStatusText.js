import React from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import SvgIcon from 'material-ui/SvgIcon';
import { applicationStatuses } from '../../../../helpers/idMaps';
import { selectExtendedApplicationStatuses } from '../../../../store';


const styleSheet = theme => ({
  Pen: {
    color: theme.palette.common.green,
  },
  Dra: {
    color: theme.palette.eoiStatus.draft,
  },
  Sen: {
    color: theme.palette.eoiStatus.draft,
  },
  Rej: {
    color: theme.palette.eoiStatus.closed,
  },
  Pre: {
    color: theme.palette.eoiStatus.completed,
  },
  Uns: {
    color: theme.palette.error[500],
  },
  Suc: {
    color: theme.palette.common.purple,
  },
  Acc: {
    color: theme.palette.common.lightGreen,
  },
  Dec: {
    color: theme.palette.common.orange,
  },
  Ret: {
    color: theme.palette.eoiStatus.closed,
  },
  Default: {
    color: theme.palette.secondary[500],
  },
  text: {
    whiteSpace: 'normal',
    maxWidth: 150,
  },
});

const ApplicationStatusText = (props) => {
  const { classes, finalStatus: { id, label } } = props;
  const colorClass = classNames(classes[id] || classes.Default);
  return (
    <Grid container direction="row" alignItems="center" wrap="nowrap" spacing={8}>
      <Grid item >
        <SvgIcon className={colorClass}>
          <circle cx="12" cy="12" r="8" />
        </SvgIcon>
      </Grid>
      <Grid item className={classes.text}>
        <Typography type="body1" color="inherit">
          {label || ''}
        </Typography>
      </Grid>
    </Grid>
  );
};

ApplicationStatusText.propTypes = {
  classes: PropTypes.object.isRequired,
  finalStatus: PropTypes.object,
};

const mapStateToProps = (state, { status, applicationStatus }) => ({
  finalStatus: !applicationStatus
    ? { id: status, label: applicationStatuses[status] }
    : { id: applicationStatus, label: selectExtendedApplicationStatuses(state)[applicationStatus] },
});


export default R.compose(
  withStyles(styleSheet, { name: 'ApplicationStatusText' }),
  connect(mapStateToProps),
)(ApplicationStatusText);
