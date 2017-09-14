
import React from 'react';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from './store';
import mainLayout from './components/layout/mainLayout';
import eoiHeader from './components/eois/eoiHeader';
import openCfeiApplications from './components/eois/details/applications/openCfeiApplications';
import cfeiOverview from './components/eois/details/overview/cfeiOverview';
import cfeiContainer from './components/eois/cfeiContainer';
import cfeiDetailsHeader from './components/eois/details/cfeiDetailsHeader';
import dashboard from './components/dashboard/dashboard';
import applications from './components/applications/applications';
import organizationProfileEdit from './components/organizationProfile/edit/tabsContainer';
import organizationProfile from './components/organizationProfile/organizationProfile';
import hqProfile from './components/organizationProfile/hq/hqProfile';
import partnersContainer from './components/partners/partnersContainer';
import hqProfileOverview from './components/organizationProfile/hq/hqProfileOverview';
import settings from './components/agencySettings/agencySettings';
import registration from './components/registration/registration';
import mainContent from './components/common/mainContentWrapper';
import dev from './components/dev';


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
            <Route path="applications" component={openCfeiApplications} />ł
          </Route>
        </Route>
      </Route>
      <Route path="partner" component={partnersContainer} />
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
    <Route path="/registration" component={registration} />
    <Route path="/dev" component={dev} />
  </Router>
);

export default allRoutes;
