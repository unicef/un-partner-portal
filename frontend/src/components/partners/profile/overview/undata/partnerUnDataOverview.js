import R from 'ramda';
import React, { Component } from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import CollapsableItem from '../../../../../components/common/collapsableItem';
import PartnerUnAgencyData from './partnerUnAgencyData';

const agencies = {
  sections: [
    { label: 'UNHCR' },
    { label: 'UNICEF' },
    { label: 'WFP' },
  ],
  sectionComponents: [
    <PartnerUnAgencyData agencyId={3} />,
    <PartnerUnAgencyData agencyId={1} />,
    <PartnerUnAgencyData agencyId={2} />,
  ],
};

const PartnerUnDataOverview = () =>
  (<Paper>
    {agencies.sections.map(item =>
      (<div key={item.label}>
        <CollapsableItem
          warning
          title={item.label}
          component={agencies.sectionComponents[R.indexOf(item, agencies.sections)]}
        />
        <Divider />
      </div>
      ))
    }
  </Paper>);

export default PartnerUnDataOverview;
