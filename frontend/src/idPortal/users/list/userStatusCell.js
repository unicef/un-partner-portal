import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import SvgIcon from 'material-ui/SvgIcon';
import { TableCell } from 'material-ui/Table';
import GridRow from '../../../components/common/grid/gridRow';

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
    maxWidth: 80,
  },
});

const UserStatusCell = (props) => {
  const { classes, status, hovered } = props;
  const colorClass = classNames(classes[status]);
  console.log(hovered);
  return (
    <TableCell>
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
        {hovered && <GridRow spacing={8} columns={3}>
          {'TEST'}
        </GridRow>}
      </GridRow>
    </TableCell>
  );
};

UserStatusCell.propTypes = {
  classes: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  hovered: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'UserStatusCell' })(UserStatusCell);
