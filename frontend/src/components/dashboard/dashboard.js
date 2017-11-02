import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import PartnerDashboard from './partnerDashboard/partnerDashboard';
import AgencyDashboard from './agencyDashboard/agencyDashboard';
import { ROLES } from '../../helpers/constants';
import MainContent from '../common/mainContentWrapper';
import HeaderNavigation from '../common/headerNavigation';
import { loadDashboard } from '../../reducers/dashboard';

const messages = {
  header: 'Dashboard',
};

class Dashboard extends Component {
  componentWillMount() {
    this.props.loadDashboardData();
  }

  render() {
    const { role, dashboard, loading } = this.props;
    return (
      <div>
        <Grid item>
          <HeaderNavigation title={messages.header} />
        </Grid>
        <MainContent>
          {role === ROLES.PARTNER
            ? <PartnerDashboard loading={loading} dashboard={dashboard} />
            : <AgencyDashboard loading={loading} dashboard={dashboard} />
          }
        </MainContent>
      </div>);
  }
}

Dashboard.propTypes = {
  role: PropTypes.string,
  loadDashboardData: PropTypes.func,
  loading: PropTypes.bool,
  dashboard: PropTypes.object,
};

const mapStateToProps = state => ({
  role: state.session.role,
  loading: state.dashboard.status.loading,
  dashboard: state.dashboard.data,
});

const mapDispatchToProps = dispatch => ({
  loadDashboardData: () => dispatch(loadDashboard()),
});


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
