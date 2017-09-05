
import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from './store';
import main from './components/main';
import mainLayout from './components/layout/mainLayout';
import eoiHeader from './components/eois/eoiHeader';
import overview from './components/eois/overview';
import pinned from './components/eois/pinned';
import calls from './components/eois/calls';
import direct from './components/eois/direct';
import cfeiDetails from './components/eois/details/cfeiDetails';
import partner from './components/partners/partnersHeader';
import dashboard from './components/dashboard/dashboard';
import applications from './components/applications/applications';
import organizationProfileEdit from './components/organizationProfile/edit/tabsContainer';
import organizationProfile from './components/organizationProfile/organizationProfile';
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
            <Route path="overview" component={overview} />
            <Route path="pinned" component={pinned} />
            <Route path="calls" component={calls} />
            <Route path="calls/:id" component={cfeiDetails} />
            <Route path="direct" component={direct} />
          </Route>
        </Route>
        <Route path="partner" component={partner} />
        <Route path="applications" component={applications} />
        <Route path="profile" component={organizationProfile} />
        <Route path="profile/edit" component={organizationProfileEdit} />
        <Route path="settings" component={settings} />
      </Route>
    </Route>
    <Route path="/registration" component={registration} />
  </Router>
);

export default allRoutes;
