import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { PROJECT_TYPES } from '../../../helpers/constants';
import TextWithColor from '../../common/textWithColorBackground';

const { OPEN, DIRECT, UNSOLICITED } = PROJECT_TYPES;

const styleSheet = theme => ({
  textBox: {
    marginBottom: theme.spacing.unit,
  },
});

const typeMap = {
  [OPEN]: { name: 'OPEN SELECTION', color: 'orange' },
  [DIRECT]: { name: 'DIRECT SELECTION/RETENTION', color: 'purple' },
  [UNSOLICITED]: { name: 'UNSOLICITED CONCEPT NOTE', color: 'blue' },

};
const CfeiDetailsHeaderProjectType = ({ classes, type, title }) => {
  if (!type) return <div />;
  const { name, color } = typeMap[type];
  return (
    <div>
      <TextWithColor className={classes.textBox} text={name} color={color} />
      <Typography type="title">
        {title}
      </Typography>
    </div>);
};

CfeiDetailsHeaderProjectType.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  classes: PropTypes.object,
};

export default withStyles(styleSheet,
  { name: 'CfeiDetailsHeaderProjectType' })(CfeiDetailsHeaderProjectType);
