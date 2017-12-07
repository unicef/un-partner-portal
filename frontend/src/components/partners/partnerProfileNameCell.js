import Typography from 'material-ui/Typography';
import React from 'react';
import classname from 'classnames';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';
import VerifiedUser from 'material-ui-icons/VerifiedUser';
import Flag from 'material-ui-icons/Flag';
import { withStyles } from 'material-ui/styles';

const styleSheet = (theme) => {
  const paddingIcon = theme.spacing.unit / 2;

  return {
    alignCenter: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    iconUnverified: {
      fill: theme.palette.error[500],
      width: 15,
      height: 15,
      margin: `0 0 0 ${paddingIcon}px`,
    },
    iconNotVerified: {
      fill: theme.palette.primary[500],
      width: 15,
      height: 15,
      margin: `0 0 0 ${paddingIcon}px`,
    },
    iconVerified: {
      fill: '#009A54',
      width: 15,
      height: 15,
      margin: `0 0 0 ${paddingIcon}px`,
    },
    iconYellow: {
      fill: '#FFC400',
      width: 15,
      height: 15,
      margin: `0 0 0 ${paddingIcon}px`,
    },
    iconRed: {
      fill: '#D50000',
      width: 15,
      height: 15,
      margin: `0 0 0 ${paddingIcon}px`,
    },
  };
};

/* eslint-disable jsx-a11y/interactive-supports-focus */
const PartnerProfileNameCell = (props) => {
  const { classes, info, onClick } = props;
  const className = classname({
    [classes.iconVerified]: info.is_verified === true,
    [classes.iconUnverified]: info.is_verified === false,
    [classes.iconNotVerified]: info.is_verified === null || info.is_verified === undefined,
  });

  return (
    <TableCell>
      <div role="button" onClick={() => onClick()} className={classes.alignCenter}>
        <Typography type="body1" color="accent">
          {info.legal_name}
        </Typography>

        <VerifiedUser className={className} />
        {info.flagging_status.yellow > 0 && <Flag className={classes.iconYellow} />}
        {info.flagging_status.red > 0 && <Flag className={classes.iconRed} />}
      </div>
    </TableCell>
  );
};

PartnerProfileNameCell.propTypes = {
  classes: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

export default withStyles(styleSheet, { name: 'PartnerProfileNameCell' })(PartnerProfileNameCell);
