
import React from 'react';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from './store';
import main from './components/main';
import mainLayout from './components/layout/mainLayout';
import eoiHeader from './components/eois/eoiHeader';
import cfeiOverview from './components/eois/details/overview/cfeiOverview';
import cfeiContainer from './components/eois/cfeiContainer';
import cfeiDetailsHeader from './components/eois/details/cfeiDetailsHeader';
import dashboard from './components/dashboard/dashboard';
import applications from './components/applications/applications';
import organizationProfileEdit from './components/organizationProfile/edit/tabsContainer';
import organizationProfile from './components/organizationProfile/organizationProfile';
import organizationProfileHeader from './components/organizationProfile/profile/organizationProfileHeader';
import partnersContainer from './components/partners/partnersContainer';
import partnerProfileHeader from './components/partners/profile/partnerProfileHeader';
import partnerOverview from './components/partners/profile/overview/partnerOverview';
import organizationProfileOverview from './components/organizationProfile/profile/organizationProfileOverview';
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
          <IndexRedirect to="open" />
          <Route component={mainContent} >
            <Route path=":type" component={cfeiContainer} />
          </Route>
        </Route>
        <Route path="cfei/:type/:id" component={cfeiDetailsHeader}>
          <IndexRedirect to="overview" />
          <Route component={mainContent} >
            <Route path="overview" component={cfeiOverview} />
            <Route path="feedback" component={null} />
            <Route path="submission" component={null} />
            <Route path="results" component={null} />
            <Route path="preselected" component={null} />
            <Route path="applications" component={null} />ł
          </Route>
        </Route>
        <Route path="partner" component={partnersContainer} />
        <Route path="partner/:id/" component={partnerProfileHeader}>
          <Route component={mainContent} >
            <Route path="overview" component={partnerOverview} />
            <Route path="details" component={organizationProfileOverview} />
            <Route path="users" component={null} />
            <Route path="applications" component={null} />
          </Route>
        </Route>
        <Route path="applications" component={applications} />
        <Route path="profile" component={organizationProfile} />
        <Route path="profile/:countryCode/edit" component={organizationProfileEdit} />
        <Route path="profile/:countryCode" component={organizationProfileHeader} >
          <IndexRedirect to="overview" />
          <Route component={mainContent} >
            <Route path="overview" component={organizationProfileOverview} />
            <Route path="users" component={null} />
          </Route>
        </Route>
        <Route path="settings" component={settings} />
      </Route>
    </Route>
    <Route path="/registration" component={registration} />
  </Router>
);

export default allRoutes;
