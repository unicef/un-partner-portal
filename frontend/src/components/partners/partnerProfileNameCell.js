import React from 'react';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ItemPartnerAdditionalInfo from '../common/cell/itemPartnerAdditionalInfoCell';

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

const PartnerProfileNameCell = (props) => {
  const { info, isHq, onClick } = props;

  return (<TableCell>
    <ItemPartnerAdditionalInfo isHq={isHq} info={info} onClick={onClick} />
  </TableCell>
  );
};

PartnerProfileNameCell.propTypes = {
  info: PropTypes.object.isRequired,
  isHq: PropTypes.bool,
  onClick: PropTypes.func,
};

export default withStyles(styleSheet, { name: 'PartnerProfileNameCell' })(PartnerProfileNameCell);
