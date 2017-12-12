import React from 'react';
import PropTypes from 'prop-types';
import { FormLabel } from 'material-ui/Form';
import { withStyles } from 'material-ui/styles';
import TooltipIcon from './tooltipIcon';


const styleSheet = () => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },

});

const FieldLabelWithTooltip = (props) => {
  const { classes,
    children,
    infoText,
    tooltipIconProps,
    labelProps,
  } = props;
  return (
    <div className={classes.root}>
      <FormLabel {...labelProps} >
        {children}
      </FormLabel>
      {infoText ? <TooltipIcon
        infoText={infoText}
        {...tooltipIconProps}
      />
        : null}
    </div>
  );
};


FieldLabelWithTooltip.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object,
  /**
   * text/component displayed inside tooltip
   */
  infoText: PropTypes.node,
  /**
   * whether tooltip should be displayed at all
   */
  displayTooltip: PropTypes.bool,
  /** 
   * props passed to tooltip icon
   */
  tooltipIconProps: PropTypes.object,
  /**
   * props passed to label
   */
  labelProps: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'FieldLabelWithTooltip' })(FieldLabelWithTooltip);
