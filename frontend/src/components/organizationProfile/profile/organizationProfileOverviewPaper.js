
import PropTypes from 'prop-types';import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import OrganizationProfileOverview from './organizationProfileOverview';
import SwitchProfileOverview from '../buttons/switchProfileOverview';

const styleSheet = () => ({
  print: {
    '@media print': {
      boxShadow: 'none',
    },
  },
});

const OrganizationProfileOverviewPaper = ({ classes, partnerId }) => (
  <React.Fragment>
    <SwitchProfileOverview />
    <Paper className={classes.print}>
      <OrganizationProfileOverview partnerId={partnerId} />
    </Paper>
  </React.Fragment>
);

OrganizationProfileOverviewPaper.propTypes = {
  classes: PropTypes.object.isRequired,
  partnerId: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  partnerId: ownProps.params.id,
});

const connected = connect(mapStateToProps, null)(OrganizationProfileOverviewPaper);
const profileWithRouter = withRouter(connected);

export default withStyles(styleSheet)(profileWithRouter);
