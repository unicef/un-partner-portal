import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import PaddedContent from '../../../common/paddedContent';


const messages = {
  upload_1: 'Please make sure to use the Concept Note template provided by the UN Agency that published this CFEI.',
  upload_2: 'You will be at risk of disqualification if the proper Concept Note formatting is not used',
};

const styleSheet = (theme) => {
  const paddingNormal = theme.spacing.unit;
  const padding = theme.spacing.unit * 3;

  return {
    paddingBottom: {
      padding: `0px 0px ${paddingNormal}px 0px`,
    },
    alignCenter: {
      margin: `${padding}px ${padding}px 0px ${padding}px`,
      padding: `${padding}px ${padding}px ${padding}px ${padding}px`,
      textAlign: 'center',
      background: theme.palette.primary[300],
    },
  };
};

const CnFileSection = (props) => {
  const { classes, component, displayHint } = props;
  return (
    <div className={classes.alignCenter}>
      {component}
      {displayHint ? null : (<PaddedContent>
        <Typography className={classes.paddingBottom} type="caption">
          {messages.upload_1}
        </Typography>
        <Typography type="caption">{messages.upload_2}</Typography>
      </PaddedContent>)
      }
    </div>
  );
};

CnFileSection.propTypes = {
  classes: PropTypes.object,
  component: PropTypes.element,
  displayHint: PropTypes.bool,

};

export default withStyles(styleSheet, { name: 'CnFileSection' })(CnFileSection);

