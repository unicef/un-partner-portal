import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import PartnerDashboard from './partnerDashboard/partnerDashboard';
import AgencyDashboard from './agencyDashboard/agencyDashboard';
import { ROLES } from '../../helpers/constants';
import MainContent from '../common/mainContentWrapper';
import HeaderNavigation from '../common/headerNavigation';

const messages = {
  header: 'Dashboard',
};

const Dashboard = (props) => {
  const { role } = props;
  return (
    <div>
      <Grid item>
        <HeaderNavigation title={messages.header} />
      </Grid>
      <MainContent>
        {role === ROLES.PARTNER
          ? <PartnerDashboard />
          : <AgencyDashboard />
        }
      </MainContent>
    </div>);
};

Dashboard.propTypes = {
  role: PropTypes.string,
};

const mapStateToProps = state => ({
  role: state.session.role,
});

export default connect(mapStateToProps)(Dashboard);
