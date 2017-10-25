
import React from 'react';
import { Router, Route, browserHistory, IndexRedirect, Redirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from './store';
import main from './components/main';
import auth from './components/auth';
import nonAuth from './components/nonAuth';
import mainLayout from './components/layout/mainLayout';
import eoiHeader from './components/eois/eoiHeader';
import openCfeiApplications from './components/eois/details/applications/openCfeiApplications';
import openCfeiPreselected from './components/eois/details/applications/openCfeiPreselected';
import cfeiOverview from './components/eois/details/overview/cfeiOverview';
import cfeiSubmission from './components/eois/details/submission/cfeiSubmission';
import cfeiContainer from './components/eois/cfeiContainer';
import cfeiDetailsHeader from './components/eois/details/cfeiDetailsHeader';
import applicationSummaryHeader from './components/eois/details/applications/applicationSummary/applicationSummaryHeader';
import applicationSummaryContainer from './components/eois/details/applications/applicationSummary/applicationSummaryContainer';
import applicationSummaryContent from './components/eois/details/applications/applicationSummary/applicationSummaryContent';
import dashboard from './components/dashboard/dashboard';
import partnerApplicationsHeader from './components/applications/partnerApplicationsHeader';
import partnerApplicationsNotes from './components/applications/notes/partnerApplicationsNotes';
import partnerApplicationsDirect from './components/applications/direct/partnerApplicationsDirect';
import partnerApplicationsUnsolicited from './components/applications/unsolicited/partnerApplicationsUnsolicited';
import organizationProfileEdit from './components/organizationProfile/edit/tabsContainer';
import organizationProfile from './components/organizationProfile/organizationProfile';
import organizationProfileHeader from './components/organizationProfile/profile/organizationProfileHeader';
import partnersContainer from './components/partners/partnersContainer';
import partnerProfileHeader from './components/partners/profile/partnerProfileHeader';
import partnerOverview from './components/partners/profile/overview/partnerOverview';
import organizationProfileOverviewPaper from './components/organizationProfile/profile/organizationProfileOverviewPaper';
import agencyMembersContainer from './components/settings/agencyMembersContainer';
import registration from './components/registration/registration';
import login from './components/login/login';
import mainContent from './components/common/mainContentWrapper';
import dev from './components/dev';
import cfeiOpenResults from './components/eois/details/overview/results/results';
import cfeiDirectResponse from './components/eois/details/overview/results/response';

const history = syncHistoryWithStore(browserHistory, store);

const allRoutes = () => (
  <Router history={history}>
    <Route component={auth}>
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
              <Route path="results" component={cfeiOpenResults} />
              <Route path="preselected" component={openCfeiPreselected} />
              <Route path="applications" component={openCfeiApplications} />
              <Route path="response" component={cfeiDirectResponse} />
            </Route>
          </Route>
          <Route component={applicationSummaryContainer} >
            <Route component={applicationSummaryHeader} >
              <Route component={mainContent} >
                <Route
                  path="cfei/:type/:id/applications/:applicationId"
                  component={applicationSummaryContent}
                />
                <Redirect
                  path="cfei/:type/:id/preselected/:applicationId"
                  to="cfei/:type/:id/applications/:applicationId"
                />
              </Route>
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
          <Route path="applications" component={partnerApplicationsHeader} >
            <IndexRedirect to="notes" />
            <Route component={mainContent} >
              <Route path="notes" component={partnerApplicationsNotes} />
              <Route path="unsolicited" component={partnerApplicationsUnsolicited} />
              <Route path="direct" component={partnerApplicationsDirect} />
            </Route>
          </Route>
          <Route path="profile" component={organizationProfile} />
          <Route path="profile/:id/edit" component={organizationProfileEdit} />
          <Route path="profile/:id" component={organizationProfileHeader} >
            <IndexRedirect to="overview" />
            <Route component={mainContent} >
              <Route path="overview" component={organizationProfileOverviewPaper} />
              <Route path="users" component={null} />
            </Route>
          </Route>
          <Route path="settings" component={agencyMembersContainer} />
        </Route>
      </Route>
    </Route>
    <Route component={nonAuth}>
      <Route path="/login" component={login} />
      <Route path="/registration" component={registration} />
      <Route path="/dev" component={dev} />
    </Route>
  </Router >
);

export default allRoutes;
