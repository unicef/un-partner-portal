import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'ramda';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import { Link, withRouter, browserHistory as history } from 'react-router';
import withConditionalDisplay from '../../common/hoc/withConditionalDisplay';
import { isUserHq, selectUserHqId, selectUserPartnerId } from '../../../store';


const messages = {
  toCountry: 'Switch to country profile >',
  toHq: 'Switch to hq profile >',
};

const styleSheet = () => ({
  button: {
    paddingBottom: 24,
  },
});

const SwitchProfileOverview = (props) => {
  const { classes, partnerId, hqId, displayToCountry } = props;
  return (<Grid spacing={0} container direction="row" justify="flex-end">
    <Grid className={classes.button} item>
      <Button
        color="accent"
        component={Link}
        to={`/profile/${displayToCountry ? partnerId : hqId}/overview`}
      >
        {displayToCountry ? messages.toCountry : messages.toHq}
      </Button>
    </Grid>
  </Grid>);
};

SwitchProfileOverview.propTypes = {
  classes: PropTypes.object,
  displayToCountry: PropTypes.bool,
  hqId: PropTypes.number,
  partnerId: PropTypes.number,
};


const mapStateToProps = (state, { params: { id: currentId } }) => {
  const partnerId = selectUserPartnerId(state);
  const hqId = selectUserHqId(state);

  return {
    displayToCountry: hqId === +currentId,
    partnerId,
    hqId,

  };
};


export default compose(
  withStyles(styleSheet),
  withRouter,
  connect(mapStateToProps),
  withConditionalDisplay([
    state => !isUserHq(state) && selectUserHqId(state),
  ]),
)(SwitchProfileOverview);
