// @flow weak
/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';

import { partnerProfileIdentification } from './partnerProfileIdentification'
import contactInfo from './partnerProfileContactInfo'
import mandate from './partnerProfileMandate'
import funding from './partnerProfileFunding'
import collaboration from './partnerProfileCollaboration';
import projectImplementation from './partnerProfileProjectImplementation'
import otherInfo from './partnerProfileOtherInfo'

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
    marginTop: theme.spacing.unit * 3,
    backgroundColor: theme.palette.background.paper,
  },
  default_tab:{
      backgroundColor: theme.palette.background.paper,
      fontWeight: 400,
    },
    active_tab:{
      color: theme.palette.primary[400],
    }
}));

class BasicTabs extends Component {
  state = {
    index: 0,
  };

  handleChange = (event, index) => {
    this.setState({ index });
  };

  render() {
    const classes = this.props.classes;

    var tabStyles =[]
    tabStyles[0] = styleSheet.default_tab;
    tabStyles[1] = styleSheet.default_tab;
    tabStyles[2] = styleSheet.default_tab;
    tabStyles[3] = styleSheet.default_tab;
    tabStyles[4] = styleSheet.default_tab;
    tabStyles[5] = styleSheet.default_tab;
    tabStyles[6] = styleSheet.default_tab;
    tabStyles[this.state.index] = Object.assign({},   tabStyles[this.state.index], styleSheet.active_tab);

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs 
            index={this.state.index} 
            onChange={this.handleChange}
            scrollable
            scrollButtons="auto"
            backgroundColor={styleSheet.backgroundColor}
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
        {this.state.index === 0 &&
          <TabContainer>
            <Paper className={classes.paper}>
            {'Item one'}
              <partnerProfileIdentification />
            </Paper>
          </TabContainer>}
        {this.state.index === 1 &&
          <TabContainer>
            {'Item Two'}
          </TabContainer>}
        {this.state.index === 2 &&
          <TabContainer>
            {'Item Three'}
          </TabContainer>}
        {this.state.index === 3 &&
          <TabContainer>
            {'Item Three'}
          </TabContainer>}
        {this.state.index === 4 &&
          <TabContainer>
            {'Item Three'}
          </TabContainer>}
        {this.state.index === 5 &&
          <TabContainer>
            {'Item Three'}
          </TabContainer>}
        {this.state.index === 6 &&
          <TabContainer>
            {'Item Three'}
          </TabContainer>}
      </div>
    );
  }
}

BasicTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(BasicTabs);