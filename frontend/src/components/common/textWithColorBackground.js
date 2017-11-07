import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import ClassName from 'classnames';


const styleSheet = (theme) => {
  const white = 'rgba(255, 255, 255, 1)';
  return {
    margin: {
      padding: `4px ${theme.spacing.unit * 1}px`,
      textAlign: 'center',
      width: 'fit-content',
    },
    red: {
      backgroundColor: theme.palette.error[800],
      color: white,
    },
    orange: {
      backgroundColor: theme.palette.common.orange,
      color: white,
    },
    purple: {
      backgroundColor: theme.palette.common.purple,
      color: white,
    },
    blue: {
      backgroundColor: theme.palette.common.blue,
      color: white,
    },
    green: {
      backgroundColor: theme.palette.common.green,
      color: white,
    },
  };
};

const TextWithColorBackground = ({ classes,
  color,
  text,
  type,
  className: classNameProp,
  ...textProps }) => {
  const className = ClassName(
    classes.margin,
    classes[color],
    classNameProp,
  );
  return <Typography type={type} className={className} {...textProps}> {text} </Typography>;
};

TextWithColorBackground.propTypes = {
  classes: PropTypes.object,
  color: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.object,
  type: PropTypes.string,
};

TextWithColorBackground.defaultProps = {
  type: 'caption',
};

export default withStyles(styleSheet, { name: 'TextWithColorBackground' })(TextWithColorBackground);
