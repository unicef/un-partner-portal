// @flow weak
/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';

import PartnerProfileIdentification from './identification/partnerProfileIdentification'
import PartnerProfileContactInfo from './contactInformation/partnerProfileContactInfo'
import Mandate from './mandate/partnerProfileMandate'
import Funding from './funding/partnerProfileFunding'
import ProjectImplementation from './projectImplementation/partnerProfileProjectImplementation'
import Collaboration from './collaboration/partnerProfileCollaboration';
import OtherInfo from './otherInfo/partnerProfileOtherInfo'

const TabContainer = props =>
  <div style={{ padding: 20 }}>
    {props.children}
  </div>;

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styleSheet = createStyleSheet(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    marginTop: 0,
    backgroundColor: theme.palette.background.paper,
  }
}));

const tabs = [
  <PartnerProfileIdentification />,
  <PartnerProfileContactInfo />,
  <Mandate />,
  <Funding />,
  <Collaboration />,
  <ProjectImplementation />,
  <OtherInfo />,
]

class BasicTabs extends Component {

  constructor(props) {
    super()
    this.state = {
      index: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, value) {
    this.setState({ index: value });
  };

  render() {
    const classes = this.props.classes;

    return (
      <div className={classes.root}>
        <AppBar position="static"
          color='white'
        >
          <Tabs 
            index={this.state.index} 
            onChange={this.handleChange}
            scrollable
            scrollButtons="auto"
          >
            <Tab label="identification" />
            <Tab label="contact info" />
            <Tab label="mandate & mission" />
            <Tab label="funding" />
            <Tab label="collaboration" />
            <Tab label="project implementation" />
            <Tab label="other information" />
          </Tabs>
        </AppBar>
        <TabContainer>
          {tabs[this.state.index]}
        </TabContainer>
      </div>
    );
  }
}

BasicTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(BasicTabs);