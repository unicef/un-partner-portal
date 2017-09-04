import main from './components/main';
import mainLayout from './components/layout/mainLayout';
import eoiHeader from './components/eois/eoiHeader';
import cfeiContainer from './components/eois/cfeiContainer';
import partner from './components/partners/partnersHeader';
import dashboard from './components/dashboard/dashboard';
import applications from './components/applications/applications';
import organizationProfileEdit from './components/organizationProfile/edit/tabsContainer';
import organizationProfile from './components/organizationProfile/organizationProfile';
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
        { path: 'partner', component: partner },
        { path: 'applications', component: applications },
        { path: 'profile', component: organizationProfile },
        { path: 'profile/edit', component: organizationProfileEdit },
        { path: 'settings', component: settings },
      ],
    }],
  },
  {
    path: '/registration',
    component: registration,
  },
];
