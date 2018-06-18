import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import SvgIcon from 'material-ui/SvgIcon';
import { projectStatuses } from '../../../helpers/idMaps';
import SpreadContent from '../../common/spreadContent';


const styleSheet = theme => ({
  Ope: {
    color: theme.palette.eoiStatus.open,
  },
  Clo: {
    color: theme.palette.eoiStatus.closed,
  },
  Com: {
    color: theme.palette.eoiStatus.completed,
  },
  Dra: {
    color: theme.palette.eoiStatus.draft,
  },
  Sen: {
    color: theme.palette.eoiStatus.draft,
  },
  text: {
    whiteSpace: 'normal',
    maxWidth: 200,
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

const EoiStatusCell = (props) => {
  const { classes, status } = props;
  const colorClass = classNames(classes[status]);

  return (
    <div className={classes.root}>
      <SvgIcon className={colorClass}>
        <circle cx="12" cy="12" r="8" />
      </SvgIcon>
      <Typography className={classes.text} type="body1" color="inherit">
        {projectStatuses[status]}
      </Typography>
    </div>
  );
};

EoiStatusCell.propTypes = {
  classes: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
};

export default withStyles(styleSheet, { name: 'EoiStatusCell' })(EoiStatusCell);
