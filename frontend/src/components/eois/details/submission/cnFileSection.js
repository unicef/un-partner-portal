import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import PaddedContent from '../../../common/paddedContent';


const messages = {
  label: 'Please ensure that the Concept Note is submitted using the template provided by the UN agency that published the Call for Expressions of Interest. Concept notes not adhering to the agency-mandated template may be disqualified.',
};

const styleSheet = (theme) => {
  const paddingNormal = theme.spacing.unit;
  const padding = theme.spacing.unit * 2;

  return {
    paddingBottom: {
      padding: `0px 0px ${paddingNormal}px 0px`,
    },
    alignCenter: {
      padding: `${padding}px ${padding}px ${padding}px ${padding}px`,
      textAlign: 'center',
      background: theme.palette.primary[300],
    },
  };
};

const CnFileSection = (props) => {
  const { classes, component, displayHint, label } = props;
  return (
    <div className={classes.alignCenter}>
      {component}
      {displayHint ? null : (<PaddedContent>
        <Typography className={classes.paddingBottom} type="caption">
          {label || messages.label}
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
  label: PropTypes.String,
};

export default withStyles(styleSheet, { name: 'CnFileSection' })(CnFileSection);

