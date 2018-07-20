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
  };
};

/* eslint-disable jsx-a11y/interactive-supports-focus */
const ItemPartnerAdditionalInfoCell = (props) => {
  const { classes, flagInfo, isVerified, legalName } = props;
  const className = classname({
    [`${classes.iconVerified} ${classes.iconSize}`]: isVerified === true,
    [`${classes.iconUnverified} ${classes.iconSize}`]: isVerified === false,
    [`${classes.iconNotVerified} ${classes.iconSize}`]: isVerified === null || isVerified === undefined,
  });

  return (
    <TableCell>
      <div role="button" className={classes.alignCenter}>
        <Typography type="body1" color="inherit">
          {legalName}
        </Typography>

        <VerifiedUser className={className} />
        {flagInfo.yellow > 0 && <Flag className={`${classes.iconYellow} ${classes.iconSize}`} />}
        {flagInfo.red > 0 && <Flag className={`${classes.iconRed} ${classes.iconSize}`} />}
      </div>
    </TableCell>
  );
};

ItemPartnerAdditionalInfoCell.propTypes = {
  classes: PropTypes.object.isRequired,
  flagInfo: PropTypes.object.isRequired,
  isVerified: PropTypes.object,
  legalName: PropTypes.string,
};

export default withStyles(styleSheet, { name: 'ItemPartnerAdditionalInfoCell' })(ItemPartnerAdditionalInfoCell);
