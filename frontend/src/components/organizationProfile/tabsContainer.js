// @flow weak
/* eslint-disable react/no-multi-comp */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PartnerProfileIdentification from './identification/partnerProfileIdentification';
import PartnerProfileContactInfo from './contactInformation/partnerProfileContactInfo';
import Mandate from './mandate/partnerProfileMandate';
import Funding from './funding/partnerProfileFunding';
import ProjectImplementation from './projectImplementation/partnerProfileProjectImplementation';
import Collaboration from './collaboration/partnerProfileCollaboration';
import OtherInfo from './otherInfo/partnerProfileOtherInfo';
import PartnerProfileTabs from './partnerProfileTabs';
import { changeTab } from '../../reducers/partnerProfileEdit';

const TabContainer = props =>
  (<div style={{ padding: 20, background: 'white' }}>
    {props.children}
  </div>);

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const tabsList = [
  { id: 0, component: <PartnerProfileIdentification />, label: 'identification', name: 'identification' },
  { id: 1, component: <PartnerProfileContactInfo />, label: 'contact info', name: 'contactInfo' },
  { id: 2, component: <Mandate />, label: 'mandate & mission', name: 'mandateMission' },
  { id: 3, component: <Funding />, label: 'funding', name: 'funding' },
  { id: 4, component: <Collaboration />, label: 'collaboration', name: 'collaboration' },
  { id: 5, component: <ProjectImplementation />, label: 'project implementation', name: 'projectImplementation' },
  { id: 6, component: <OtherInfo />, label: 'other information', name: 'otherInformation' },
];

const TabsContainer = (props) => {
  const { currentTab, onTabClick } = props;
  return (
    <PartnerProfileTabs
      currentTab={currentTab}
      tabsList={tabsList}
      onTabClick={onTabClick}
    />
  );
};

TabsContainer.propTypes = {
  currentTab: PropTypes.number,
  onTabClick: PropTypes.func,
};

const mapState = state => ({
  currentTab: state.partnerProfileEdit.currentTab,
});

const mapDispatch = dispatch => ({
  onTabClick: (e, id) => dispatch(changeTab(id)),
});

export default connect(
  mapState,
  mapDispatch,
)(TabsContainer);
