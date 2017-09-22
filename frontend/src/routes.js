
import React from 'react';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from './store';
import main from './components/main';
import mainLayout from './components/layout/mainLayout';
import eoiHeader from './components/eois/eoiHeader';
import openCfeiApplications from './components/eois/details/applications/openCfeiApplications';
import cfeiOverview from './components/eois/details/overview/cfeiOverview';
import cfeiSubmission from './components/eois/details/submission/cfeiSubmission';
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
import organizationProfileOverviewPaper from './components/organizationProfile/profile/organizationProfileOverviewPaper';
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
            <Route path="submission" component={cfeiSubmission} />
            <Route path="results" component={null} />
            <Route path="preselected" component={null} />
            <Route path="applications" component={openCfeiApplications} />ł
          </Route>
        </Route>
        <Route path="partner" component={partnersContainer} />
        <Route path="partner/:id/" component={partnerProfileHeader}>
          <Route component={mainContent} >
            <Route path="overview" component={partnerOverview} />
            <Route path="details" component={organizationProfileOverviewPaper} />
            <Route path="users" component={null} />
            <Route path="applications" component={null} />
          </Route>
        </Route>
        <Route path="applications" component={applications} />
        <Route path="profile" component={organizationProfile} />
        <Route path="profile/:id/edit" component={organizationProfileEdit} />
        <Route path="profile/:id" component={organizationProfileHeader} >
          <IndexRedirect to="overview" />
          <Route component={mainContent} >
            <Route path="overview" component={organizationProfileOverviewPaper} />
            <Route path="users" component={null} />
          </Route>
        </Route>
        <Route path="settings" component={settings} />
      </Route>
    </Route>
    <Route path="/registration" component={registration} />
    <Route path="/dev" component={dev} />
  </Router>
);

export default allRoutes;
