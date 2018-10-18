import Typography from 'material-ui/Typography';
import React from 'react';
import classname from 'classnames';
import PropTypes from 'prop-types';
import VerifiedUser from 'material-ui-icons/VerifiedUser';
import Flag from 'material-ui-icons/Flag';
import { withStyles } from 'material-ui/styles';

const messages = {
  hq: 'HQ',
}

const styleSheet = (theme) => {
  const paddingIcon = theme.spacing.unit / 2;

  return {
    alignCenter: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    iconSize: {
      width: 15,
      height: 15,
      margin: `0 0 0 ${paddingIcon}px`,
    },
    iconUnverified: {
      fill: theme.palette.error[500],
    },
    iconNotVerified: {
      fill: theme.palette.primary[500],
    },
    iconVerified: {
      fill: '#009A54',
    },
    iconYellow: {
      fill: '#FFC400',
    },
    iconRed: {
      fill: '#D50000',
    },
    hq: {
      fontSize: '10px',
      marginLeft: `${paddingIcon}px`,
      padding: '0px 6px 0px 6px',
      background: theme.palette.secondary[500],
      color: '#FFF',
    },
  };
};

/* eslint-disable jsx-a11y/interactive-supports-focus */
const ItemPartnerAdditionalInfoCell = (props) => {
  const { classes, info, isHq, permission, onClick } = props;
  const className = classname({
    [`${classes.iconVerified} ${classes.iconSize}`]: info.is_verified === true,
    [`${classes.iconUnverified} ${classes.iconSize}`]: info.is_verified === false,
    [`${classes.iconNotVerified} ${classes.iconSize}`]: info.is_verified === null || info.is_verified === undefined,
  });

  return (
    <div role="button" className={classes.alignCenter}>
      <Typography type="body1" color="accent" onClick={onClick}>
        {info.legal_name}
      </Typography>
      {isHq && <Typography type="body1" className={classes.hq}>{messages.hq}</Typography>}
      <VerifiedUser className={className} />
      {permission && info.flagging_status.yellow > 0 && <Flag className={`${classes.iconYellow} ${classes.iconSize}`} />}
      {permission && info.flagging_status.red > 0 && <Flag className={`${classes.iconRed} ${classes.iconSize}`} />}
    </div>
  );
};

ItemPartnerAdditionalInfoCell.propTypes = {
  classes: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  isHq: PropTypes.bool,
  permission: PropTypes.bool,
  onClick: PropTypes.func,
};

export default withStyles(styleSheet, { name: 'ItemPartnerAdditionalInfoCell' })(ItemPartnerAdditionalInfoCell);
