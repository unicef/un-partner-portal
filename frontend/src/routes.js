import main from './components/main';
import mainLayout from './components/layout/mainLayout';
import eoiHeader from './components/eois/eoiHeader';
import cfeiContainer from './components/eois/cfeiContainer';
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
          component: eoiHeader,
          path: 'cfei',
          childRoutes: [
            { component: mainContent,
              childRoutes: [
                { path: ':type', component: cfeiContainer },
              ],
            },
          ],
        },
        { path: 'partner', component: partnersContainer },
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
