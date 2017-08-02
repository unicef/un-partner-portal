
import main from './components/main';
import mainLayout from './components/layout/mainLayout';
import eoi from './components/eois/eoiHeader';
import partner from './components/partners/partnersHeader';
import dashboard from './components/dashboard/dashboard';
import applications from './components/applications/applications';
import profile from './components/organizationProfile/organizationProfile';
import settings from './components/agencySettings/agencySettings';

export default [
  {
    // we will prob need pathless component to wrap theme depending on the user
    component: main,
    childRoutes: [{
      path: '/',
      component: mainLayout,
      childRoutes: [
        { path: 'dashboard', component: dashboard },
        { path: 'cfei', component: eoi },
        { path: 'partner', component: partner },
        { path: 'applications', component: applications },
        { path: 'profile', component: profile },
        { path: 'settings', component: settings },
      ],
    }],
  },
];
