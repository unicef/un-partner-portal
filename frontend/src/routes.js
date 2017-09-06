
import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from './store';
import main from './components/main';
import mainLayout from './components/layout/mainLayout';
import eoiHeader from './components/eois/eoiHeader';
import cfeiDetails from './components/eois/details/cfeiDetails';
import cfeiContainer from './components/eois/cfeiContainer';
import partner from './components/partners/partnersHeader';
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
          <Route component={mainContent} >
            <Route path=":type" component={cfeiContainer} />
            <Route path=":type/:id" component={cfeiDetails} />
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
    <Route path="/dev" component={dev} />
  </Router>
);

export default allRoutes;
