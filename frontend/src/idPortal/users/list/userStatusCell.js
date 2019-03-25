import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import SvgIcon from 'material-ui/SvgIcon';
import { TableCell } from 'material-ui/Table';
import GridRow from '../../../components/common/grid/gridRow';
import EditUserButton from './editUserButton';
import MoreUserButton from './moreUserButton';

const styleSheet = theme => ({
  Active: {
    color: theme.palette.userStatus.active,
  },
  Invited: {
    color: theme.palette.userStatus.invited,
  },
  Deactivated: {
    color: theme.palette.userStatus.deactivated,
  },
  text: {
    whiteSpace: 'normal',
    maxWidth: 100,
  },
  options: {
    display: 'flex',
    float: 'right',
    alignItems: 'center',
  },
  root: {
    height: 58,
  },
});

const UserStatusCell = (props) => {
  const { classes, status, active, hovered, id } = props;
  const colorClass = classNames(classes[status]);

  return (
    <TableCell className={classes.root}>
      <GridRow alignItems="center" >
        <Grid container direction="row" alignItems="center" wrap="nowrap" spacing={8}>
          <Grid item >
            <SvgIcon className={colorClass}>
              <circle cx="12" cy="12" r="8" />
            </SvgIcon>
          </Grid>
          <Grid item className={classes.text}>
            <Typography type="body1" color="inherit">
              {status}
            </Typography>
          </Grid>
        </Grid>
        <div className={classes.options}>
          {hovered && status !== 'Deactivated' && <EditUserButton id={id} />}
          {hovered && <MoreUserButton isActive={active} id={id} />}
        </div>
      </GridRow>
    </TableCell>
  );
};

UserStatusCell.propTypes = {
  classes: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  hovered: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'UserStatusCell' })(UserStatusCell);
