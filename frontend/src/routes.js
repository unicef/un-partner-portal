
import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from './store';
import main from './components/main';
import mainLayout from './components/layout/mainLayout';
import eoiHeader from './components/eois/eoiHeader';
import cfeiDetails from './components/eois/details/cfeiDetails';
import cfeiContainer from './components/eois/cfeiContainer';
import dashboard from './components/dashboard/dashboard';
import applications from './components/applications/applications';
import organizationProfileEdit from './components/organizationProfile/edit/tabsContainer';
import organizationProfile from './components/organizationProfile/organizationProfile';
import hqProfile from './components/organizationProfile/hq/hqProfile';
import partnersContainer from './components/partners/partnersContainer';
import partnerProfile from './components/partners/profile/partnerProfile';
import partnerOverview from './components/partners/profile/overview/partnerOverview';
import hqProfileOverview from './components/organizationProfile/hq/hqProfileOverview';
import settings from './components/agencySettings/agencySettings';
import registration from './components/registration/registration';
import mainContent from './components/common/mainContentWrapper';

const history = syncHistoryWithStore(browserHistory, store);

const allRoutes = () => (
  <Router history={history}>
    <Route component={main}>
      <Route path="/" component={mainLayout} >
        <Route path="dashboard" component={dashboard} />
        <Route path="cfei" component={eoiHeader} >
          <Route component={mainContent} >
            <Route path=":type" component={cfeiContainer} />
            <Route path="open/:id" component={cfeiDetails} />
          </Route>
        </Route>
        <Route path="partner" component={partnersContainer} />
        <Route path="partner/:id" component={partnerProfile}>
          <Route component={mainContent} >
            <Route path="overview" component={partnerOverview} />
            <Route path="details" component={hqProfileOverview} />
            <Route path="users" component={null} />
            <Route path="applications" component={null} />
          </Route>
        </Route>
        <Route path="applications" component={applications} />
        <Route path="profile" component={organizationProfile} />
        <Route path="profile/edit" component={organizationProfileEdit} />
        <Route path="profile/hq" component={hqProfile} >
          <Route component={mainContent} >
            <Route path="overview" component={hqProfileOverview} />
            <Route path="user" component={null} />
          </Route>
        </Route>
        <Route path="settings" component={settings} />
      </Route>
    </Route>
    <Route path="/registration" component={registration} />
  </Router>
);

export default allRoutes;
