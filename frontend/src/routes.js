
import main from './components/main';
import mainLayout from './components/layout/mainLayout';
import eoiHeader from './components/eois/eoiHeader';
import overview from './components/eois/overview';
import pinned from './components/eois/pinned';
import partner from './components/partners/partnersHeader';
import dashboard from './components/dashboard/dashboard';
import applications from './components/applications/applications';
import partnerProfile from './components/organizationProfile/partnerProfile';
import settings from './components/agencySettings/agencySettings';
import registration from './components/registration/registration';

import identification from './components/organizationProfile/identification/partnerProfileIdentification'
import contactInfo from './components/organizationProfile/contactInformation/partnerProfileContactInfo'
import mandate from './components/organizationProfile/mandate/partnerProfileMandate'
import funding from './components/organizationProfile/funding/partnerProfileFunding'
import collaboration from './components/organizationProfile/collaboration/partnerProfileCollaboration';
import projectImplementation from './components/organizationProfile/projectImplementation/partnerProfileProjectImplementation'
import otherInfo from './components/organizationProfile/otherInfo/partnerProfileOtherInfo'

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
        { path: 'profile', component: partnerProfile },
        { path: 'settings', component: settings },
        { path: 'profile/identification', component: identification },
        { path: 'profile/contactInfo', component: contactInfo },
        { path: 'profile/mandate', component: mandate },
        { path: 'profile/funding', component: funding },
        { path: 'profile/collaboration', component: collaboration },
        { path: 'profile/projectImplementation', component: projectImplementation },
        { path: 'profile/otherInfo', component: otherInfo },
      ],
    }],
  },
  {
    path: '/registration',
    component: registration,
  },
];
