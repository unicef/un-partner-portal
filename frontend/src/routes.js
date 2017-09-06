import main from './components/main';
import mainLayout from './components/layout/mainLayout';
import eoiHeader from './components/eois/eoiHeader';
import overview from './components/eois/overview';
import pinned from './components/eois/pinned';
import calls from './components/eois/calls';
import direct from './components/eois/direct';
import dashboard from './components/dashboard/dashboard';
import applications from './components/applications/applications';
import organizationProfileEdit from './components/organizationProfile/edit/tabsContainer';
import organizationProfile from './components/organizationProfile/organizationProfile';
import hqProfile from './components/organizationProfile/hq/hqProfile';
import partnersContainer from './components/partners/partnersContainer';
import partnerProfile from './components/partners/details/partnerProfile';
import hqProfileOverview from './components/organizationProfile/hq/hqProfileOverview';
import settings from './components/agencySettings/agencySettings';
import registration from './components/registration/registration';
import mainContent from './components/common/mainContentWrapper';

export default [
  {
    // we will prob need pathless component to wrap theme depending on the user
    component: main,
    childRoutes: [{
      path: '/',
      component: mainLayout,
      childRoutes: [
        { path: 'dashboard', component: dashboard },
        {
          path: 'cfei',
          component: eoiHeader,
          childRoutes: [
            { component: mainContent,
              childRoutes: [
                { path: 'overview', component: overview },
                { path: 'pinned', component: pinned },
                { path: 'calls', component: calls },
                { path: 'direct', component: direct },
              ],
            },
          ],
        },
        { path: 'partner', component: partnersContainer },
        { path: 'partner/info',
          component: partnerProfile,
          childRoutes: [
            { component: mainContent,
              childRoutes: [
                { path: 'overview', component: null },
                { path: 'details', component: hqProfileOverview },
                { path: 'user', component: null },
                { path: 'applications', component: null },
              ],
            },
          ],
        },
        { path: 'applications', component: applications },
        { path: 'profile', component: organizationProfile },
        { path: 'profile/edit', component: organizationProfileEdit },
        { path: 'profile/hq',
          component: hqProfile,
          childRoutes: [
            { component: mainContent,
              childRoutes: [
                { path: 'overview', component: hqProfileOverview },
                { path: 'user', component: null },
              ],
            },
          ],
        },
        { path: 'settings', component: settings },
      ],
    }],
  },
  {
    path: '/registration',
    component: registration,
  },
];
