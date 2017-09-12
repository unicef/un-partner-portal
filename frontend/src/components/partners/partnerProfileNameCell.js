import Typography from 'material-ui/Typography';
import React from 'react';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';
import VerifiedUser from 'material-ui-icons/VerifiedUser';
import Flag from 'material-ui-icons/Flag';
import { withStyles, createStyleSheet } from 'material-ui/styles';

const styleSheet = createStyleSheet('CountryOfficesHeader', (theme) => {
  const paddingIcon = theme.spacing.unit / 2;
  
  return {
    alignCenter: {
      display: 'flex',
      alignItems: 'center',
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
});

const PartnerProfileNameCell = (props) => {
  const { classes, name, verified, yellowFlag, redFlag } = props;
  return (
    <TableCell>
      <div className={classes.alignCenter}>
        <Typography type="body1" color="inherit">
          {name}
        </Typography>

        {verified ?
          <VerifiedUser className={classes.iconVerified} />
          : <VerifiedUser className={classes.iconNotVerified} />}
        {yellowFlag ? <Flag className={classes.iconYellow} /> : null}
        {redFlag ? <Flag className={classes.iconRed} /> : null}
      </div>
    </TableCell>
  );
};

PartnerProfileNameCell.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.object.isRequired,
  verified: PropTypes.bool.isRequired,
  yellowFlag: PropTypes.bool,
  redFlag: PropTypes.bool,
};

export default withStyles(styleSheet)(PartnerProfileNameCell);
