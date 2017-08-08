
import main from './components/main';
import mainLayout from './components/layout/mainLayout';
import eoi from './components/eois/eoiHeader';
import partner from './components/partners/partnersHeader';
import dashboard from './components/dashboard/dashboard';
import applications from './components/applications/applications';
import partnerProfile from './components/organizationProfile/partnerProfile';
import settings from './components/agencySettings/agencySettings';
import registration from './components/registration/registration';

import identification from './components/organizationProfile/partnerProfileIdentification'
import contactInfo from './components/organizationProfile/partnerProfileContactInfo'
import mandate from './components/organizationProfile/partnerProfileMandate'
import funding from './components/organizationProfile/partnerProfileFunding'
import collaboration from './components/organizationProfile/partnerProfileCollaboration';
import projectImplementation from './components/organizationProfile/partnerProfileProjectImplementation'
import otherInfo from './components/organizationProfile/partnerProfileOtherInfo'

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
