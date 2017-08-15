
import main from './components/main';
import mainLayout from './components/layout/mainLayout';
import eoiHeader from './components/eois/eoiHeader';
import overview from './components/eois/overview';
import pinned from './components/eois/pinned';
import partner from './components/partners/partnersHeader';
import dashboard from './components/dashboard/dashboard';
import applications from './components/applications/applications';
import profile from './components/organizationProfile/organizationProfile';
import settings from './components/agencySettings/agencySettings';
import registration from './components/registration/registration';


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
          // indexRoute: { path: 'overview', component: overview },
          childRoutes: [
            { path: 'overview', component: overview },
            { path: 'pinned', component: pinned },
          ],
        },
        { path: 'partner', component: partner },
        { path: 'applications', component: applications },
        { path: 'profile', component: profile },
        { path: 'settings', component: settings },
      ],
    }],
  },
  {
    path: '/registration',
    component: registration,
  },
];
