import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import ReactTooltip from 'react-tooltip';
import Typography from 'material-ui/Typography';


const styleSheet = createStyleSheet('OrganizationTypes', () => ({
  paper: {
    padding: '4px !important',
  },
  text: {
    whiteSpace: 'pre-line',
    fontSize: 12,
  },
}));

const renderTooltipContent = (content, classes) => {
  if (typeof content === 'string') {
    return (
      <Typography type="body2" color="inherit" className={classes.text} align="left">
        {content}
      </Typography>
    );
  }
  return content;
};

function Tooltip(props) {
  const { classes, text, id } = props;
  return (
    <ReactTooltip id={id} class={classes.paper} place="bottom" effect="solid" >
      { renderTooltipContent(text, classes) }
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

export default withStyles(styleSheet)(Tooltip);
