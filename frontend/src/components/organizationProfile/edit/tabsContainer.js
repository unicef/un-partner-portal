import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { browserHistory as history } from 'react-router';
import PartnerProfileIdentification from './identification/partnerProfileIdentification';
import PartnerProfileContactInfo from './contactInformation/partnerProfileContactInfo';
import Mandate from './mandate/partnerProfileMandate';
import Funding from './funding/partnerProfileFunding';
import ProjectImplementation from './projectImplementation/partnerProfileProjectImplementation';
import Collaboration from './collaboration/partnerProfileCollaboration';
import OtherInfo from './otherInfo/partnerProfileOtherInfo';
import { changeTab } from '../../../reducers/partnerProfileEdit';

const styleSheet = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    marginTop: 0,
    backgroundColor: theme.palette.background.paper,
  },
  tabContainer: {
    padding: 20,
    background: 'white',
  },
});


const tabsList = [
  { id: 0, component: <PartnerProfileIdentification />, label: 'identification', name: 'identification' },
  { id: 1, component: <PartnerProfileContactInfo />, label: 'contact info', name: 'mailing' },
  { id: 2, component: <Mandate />, label: 'mandate & mission', name: 'mandate_mission' },
  { id: 3, component: <Funding />, label: 'funding', name: 'fund' },
  { id: 4, component: <Collaboration />, label: 'collaboration', name: 'collaboration' },
  { id: 5, component: <ProjectImplementation />, label: 'project implementation', name: 'project_impl' },
  { id: 6, component: <OtherInfo />, label: 'other information', name: 'otherInformation' },
];

class TabsContainer extends Component {
  constructor(props) {
    super(props);

    this.renderTab = this.renderTab.bind(this);
  }

  updatePath() {
    const { tabs, params: { type } } = this.props;
    const index = tabs.findIndex(itab => itab.path === type);
    if (index === -1) {
      // TODO: do real 404
      history.push('/');
    }
    return index;
  }

  renderTab() {
    const { tabs, params: { type } } = this.props;
    const tabIndex = R.findIndex(R.propEq('path', type))(tabs);

    return tabsList[tabIndex].component;
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.tabContainer}>
        {this.renderTab()}
      </Paper>
    );
  }
}

TabsContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  currentTab: PropTypes.number,
  onTabClick: PropTypes.func,
  location: PropTypes.object,
};

const mapState = (state, ownProps) => ({
  location: ownProps.params,
  currentTab: state.partnerProfileEdit.currentTab,
  tabs: state.partnerProfileDetailsNav.tabs, 
});

const mapDispatch = dispatch => ({
  onTabClick: (e, id) => dispatch(changeTab(id)),
});

const connectedTabsContainer = connect(mapState, mapDispatch)(TabsContainer);

export default withStyles(styleSheet, { name: 'TabsContainer' })(connectedTabsContainer);
