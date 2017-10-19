import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';

import EoiStatusCell from './eoiStatusCell';
import TooltipIcon from '../../common/tooltipIcon';
import PinIcon from '../../common/pinIcon';


const styleSheet = theme => ({
  pinnedIcon: {
    fill: theme.palette.success.primary,
  },
});

const EoiStatusWithIconsCell = (props) => {
  const { classes, item, hoverOn, message, simple } = props;
  return (
    <div>
      {hoverOn === item.id
        ? <TooltipIcon
          Icon={PinIcon}
          infoText={message}
          displayTooltip={simple || !item.pinned}
          iconClass={!simple && item.pinned ? classes.pinnedIcon : ''}
        />
        : <EoiStatusCell id={item.status} />
      }
    </div>
  );
};

EoiStatusWithIconsCell.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  hoverOn: PropTypes.bool,
  message: PropTypes.string,
  simple: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'EoiStatusWithIconsCell' })(EoiStatusWithIconsCell);
