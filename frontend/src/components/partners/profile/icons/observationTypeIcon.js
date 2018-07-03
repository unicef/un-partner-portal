import React from 'react';
import { FLAGS } from '../../../../helpers/constants';
import ObservationIcon from './observationIcon';
import FlagIcon from './flagIcon';
import EscalatedIcon from './escalatedIcon';

const messages = {
  flagObs: 'Not risk-related',
  flagYel: 'Risk flag',
  flagRed: 'Red flag',
  flagEsc: 'Risk flag escalated to UN Headquarters Editor',
};

const ObservationTypeIcon = (flagType) => {
  if (flagType === FLAGS.OBSERVATION) {
    return <div style={{ display: 'flex', alignItems: 'center' }}><ObservationIcon /> {messages.flagObs}</div>;
  } else if (flagType === FLAGS.YELLOW) {
    return <div style={{ display: 'flex', alignItems: 'center' }}><FlagIcon color={FLAGS.YELLOW} /> {messages.flagYel}</div>;
  } else if (flagType === FLAGS.RED) {
    return <div style={{ display: 'flex', alignItems: 'center' }}><FlagIcon color={FLAGS.RED} /> {messages.flagRed}</div>;
  } else if (flagType === FLAGS.ESCALATED) {
    return <div style={{ display: 'flex', alignItems: 'center' }}><EscalatedIcon /> {messages.flagEsc}</div>;
  } return null;
};

export default ObservationTypeIcon;

