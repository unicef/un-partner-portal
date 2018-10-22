
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
import organizationProfile from './components/organizationProfile/organizationProfile';
import organizationProfileHeader from './components/organizationProfile/profile/organizationProfileHeader';
import partnersContainer from './components/partners/partnersContainer';
import partnerProfileEdit from './components/organizationProfile/edit/partnerProfileEdit';
import TabsContainer from './components/organizationProfile/edit/tabsContainer';
import partnerProfileHeader from './components/partners/profile/partnerProfileHeader';
import partnerOverview from './components/partners/profile/overview/partnerOverview';
import partnerUnData from './components/partners/profile/overview/undata/partnerUnData';
import partnerVerification from './components/partners/profile/overview/partnerVerification';
import organizationProfileOverviewPaper from './components/organizationProfile/profile/organizationProfileOverviewPaper';
import registration from './components/registration/registration';
import login from './components/login/login';
import azureLogin from './components/login/azureLogin';
import passwordReset from './components/passwordReset/passwordReset';
import setPassword from './components/setPassword/setPassword';
import mainContent from './components/common/mainContentWrapper';
import dev from './components/dev';
import cfeiOpenResults from './components/eois/details/overview/results/results';
import cfeiDirectResponse from './components/eois/details/overview/results/response';
import cfeiFeedback from './components/eois/details/overview/feedback';
import partnerApplicationList from './components/agency/partnerApplicationList';
import partnerObservationsList from './components/partners/profile/overview/observations/partnerObservationsList';
import partnerInfoContainer from './components/reports/partnerInformation/partnerInfoContainer';
import cfeiManagementContainer from './components/reports/cfeiManagement/cfeiManagementContainer';
import verificationContainer from './components/reports/verifcation/verificationContainer';
import reportsHeader from './components/reports/reportsHeader';
import partnerUsersContainer from './components/partners/members/partnerUsersContainer';
import userProfile from './components/user/userProfile';
import openCfeiRequests from './components/eois/details/applications/openCfeiRequests';

// ID portal
import mainLayoutIdPortal from './idPortal/mainLayout';
import mainIdPortal from './idPortal/main';
import dashboardIdPortal from './idPortal/dashboard/dashboard';
import usersIdPortal from './idPortal/users/list/usersContainer';


const history = syncHistoryWithStore(browserHistory, store);

function checkPartnerType(nextState, replace) {
  const state = store.getState();

  if (!state.session.isHq && state.session.authorized) {
    replace({ pathname: `profile/${state.session.partnerId}/overview` });
  }
}

const allRoutes = () => (
  <Router history={history}>
    <Route component={auth}>
      <Route component={main}>
        <Route path="/dev" component={dev} />
        <Route path="/" component={mainLayout} >
          <IndexRedirect to="dashboard" />
          <Route path="dashboard" component={dashboard} />
          <Route path="user" component={userProfile} />
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
              <Route path="feedback" component={cfeiFeedback} />
              <Route path="submission" component={cfeiSubmission} />
              <Route path="results" component={cfeiOpenResults} />
              <Route path="requests" component={openCfeiRequests} />
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
              <Route path="undata" component={partnerUnData} />
              <Route path="users" component={partnerUsersContainer} />
              <Route path="verification" component={partnerVerification} />
              <Route path="observations" component={partnerObservationsList} />
              <Route path="applications" component={partnerApplicationList} />
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
          <Route path="profile" onEnter={checkPartnerType} component={organizationProfile} />
          <Route path="profile/:id/edit" component={partnerProfileEdit}>
            <IndexRedirect to="identification" />
            <Route component={mainContent} >
              <Route path=":type" component={TabsContainer} />
            </Route>
          </Route>
          <Route path="profile/:id" component={organizationProfileHeader} >
            <IndexRedirect to="overview" />
            <Route component={mainContent} >
              <Route path="overview" component={organizationProfileOverviewPaper} />
              <Route path="undata" component={partnerUnData} />
            </Route>
          </Route>
          <Route path="reports" component={reportsHeader}>
            <IndexRedirect to="information" />
            <Route component={mainContent}>
              <Route path="information" component={partnerInfoContainer} />
              <Route path="management" component={cfeiManagementContainer} />
              <Route path="verification" component={verificationContainer} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route component={mainIdPortal}>
        <Route path="/idp" component={mainLayoutIdPortal} >
          <IndexRedirect to="dashboard" />
          <Route path="dashboard" component={dashboardIdPortal} />
          <Route path="users" component={usersIdPortal} />
        </Route>
      </Route>
    </Route>
    <Route component={nonAuth}>
      <Route path="/login" component={azureLogin} />
      <Route path="/direct-login" component={login} />
      <Route path="/password-reset/:uid/:token" component={passwordReset} />
      <Route path="/set-password/:uid/:token" component={setPassword} />
      <Route path="/registration" component={registration} />
    </Route>
  </Router>
);
export default allRoutes;
