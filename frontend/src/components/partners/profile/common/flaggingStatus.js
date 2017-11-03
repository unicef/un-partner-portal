import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import FlagIcon from '../icons/flagIcon';
import { FLAGS } from '../../../../helpers/constants';

const messages = {
  noFlag: 'No Flag',
};

const FlaggingStatus = (props) => {
  const { flags: { red, yellow }, noFlagText } = props;
  if (red || yellow) {
    return (<Grid container spacing={4}>
      {yellow > 0 && ([<Grid item>
        <Typography>
          {yellow}
        </Typography>
      </Grid>,
      <Grid item>
        <FlagIcon color={FLAGS.YELLOW} />
      </Grid>])}
      {red > 0 && ([<Grid item>
        <Typography>
          {red}
        </Typography>
      </Grid>,
      <Grid item>
        <FlagIcon color={FLAGS.RED} />
      </Grid>])}
    </Grid>);
  }
  if (noFlagText) return <Typography>{messages.noFlag}</Typography>;
  return <div />;
};

FlaggingStatus.propTypes = {
  flags: PropTypes.object,
  noFlagText: PropTypes.bool,
};

export default FlaggingStatus;
