import React from 'react';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import { FLAGS } from '../../../../helpers/constants';
import ObservationIcon from './observationIcon';
import FlagIcon from './flagIcon';
import EscalatedIcon from './escalatedIcon';

const styleSheet = theme => ({
  flagBg: {
    marginLeft: '5px',
    padding: '0 2px',
    background: theme.palette.flags.background,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
  },
});


const messages = {
  flagObs: 'Not risk-related',
  flagYel: 'Risk flag',
  noValid: 'NO LONGER VALID',
  deffered: 'DEFFERED',
  notMatch: 'NOT A TRUE MATCH',
  flagRed: 'Red flag',
  flagEsc: 'Risk flag escalated to UN Headquarters Editor',
};

const ObservationTypeIcon = (props) => {
  const { classes, flagType, isValid, isEscalated, category } = props;

  if (flagType === FLAGS.OBSERVATION) {
    return (<div className={classes.center}>
      <ObservationIcon />
      <Typography type="body1">{messages.flagObs}</Typography>
    </div>);
  } else if (flagType === FLAGS.YELLOW && isEscalated === false && isValid === null) {
    return (<div className={classes.center}>
      <FlagIcon color={FLAGS.YELLOW} />
      <Typography type="body1">{messages.flagYel}</Typography>
      <Typography className={classes.flagBg} type="caption">{messages.deffered}</Typography>
    </div>);
  } else if (flagType === FLAGS.YELLOW && isValid === false && category !== FLAGS.SANCTION) {
    return (<div className={classes.center}>
      <FlagIcon color={FLAGS.YELLOW} />
      <Typography type="body1">{messages.flagYel}</Typography>
      <Typography className={classes.flagBg} type="caption">{messages.noValid}</Typography>
    </div>);
  } else if (flagType === FLAGS.YELLOW && isValid === false && category === FLAGS.SANCTION) {
    return (<div className={classes.center}>
      <FlagIcon color={FLAGS.YELLOW} />
      <Typography type="body1">{messages.flagYel}</Typography>
      <Typography className={classes.flagBg} type="caption">{messages.notMatch}</Typography>
    </div>);
  } else if (flagType === FLAGS.YELLOW) {
    return (<div className={classes.center}>
      <FlagIcon color={FLAGS.YELLOW} />
      <Typography type="body1">{messages.flagYel}</Typography>
    </div>);
  } else if (flagType === FLAGS.RED) {
    return (<div className={classes.center}>
      <FlagIcon color={FLAGS.RED} />
      <Typography type="body1">{messages.flagRed}</Typography>
    </div>);
  } else if (flagType === FLAGS.ESCALATED) {
    return (<div className={classes.center}>
      <EscalatedIcon />
      <Typography type="body1">{messages.flagEsc}</Typography>
    </div>);
  } return null;
};

ObservationTypeIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  flagType: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
  isEscalated: PropTypes.bool.isRequired,
  category: PropTypes.string,
};

export default withStyles(styleSheet, { name: 'ObservationTypeIcon' })(ObservationTypeIcon);

