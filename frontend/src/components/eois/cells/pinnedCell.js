import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import PinIcon from '../../common/pinIcon';
import { isCfeiPinned } from '../../../store';

const PinnedCell = ({ pinned }) => (pinned ? (
  <Grid container direction="row" alignItems="center" wrap="nowrap" spacing={8}>
    <Grid item>
      <PinIcon />
    </Grid>
    <Grid item>
      <Typography type="body1" color="inherit">Pinned</Typography>
    </Grid>
  </Grid>
) : null);

PinnedCell.propTypes = {
  id: PropTypes.string,
  pinned: PropTypes.bool,
};

export default connect(
  (state, ownProps) => ({
    pinned: isCfeiPinned(state, ownProps.id),
  }),
)(PinnedCell);
