import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ReactTooltip from 'react-tooltip';
import TooltipText from './text/tooltipText';


const styleSheet = theme => ({
  paper: {
    padding: '8px !important',
    background: 'solid',
    backgroundColor: `${theme.palette.primary[700]} !important`,
  },
});

const renderTooltipContent = (content) => {
  if (typeof content === 'string') {
    return (
      <TooltipText type="body1" color="inherit" align="left">
        {content}
      </TooltipText>
    );
  }
  return content;
};

function Tooltip(props) {
  const { classes, text, id } = props;
  return (
    <ReactTooltip id={id} class={classes.paper} place="bottom" effect="solid" >
      { renderTooltipContent(text)}
    </ReactTooltip>
  );
}

Tooltip.propTypes = {
  /**
  * tooltip content, can be a string or object
  */
  text: PropTypes.string,
  classes: PropTypes.object,
  id: PropTypes.string,

};

export default withStyles(styleSheet, { name: 'Tooltip' })(Tooltip);
