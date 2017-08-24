import main from './components/main';
import mainLayout from './components/layout/mainLayout';
import eoiHeader from './components/eois/eoiHeader';
import overview from './components/eois/overview';
import pinned from './components/eois/pinned';
import calls from './components/eois/calls';
import direct from './components/eois/direct';
import partner from './components/partners/partnersHeader';
import dashboard from './components/dashboard/dashboard';
import applications from './components/applications/applications';
import partnerProfile from './components/organizationProfile/tabsContainer';
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
        { path: 'partner', component: partner },
        { path: 'applications', component: applications },
        { path: 'profile', component: partnerProfile },
        { path: 'settings', component: settings },
      ],
    }],
  },
  {
    path: '/registration',
    component: registration,
  },
];
