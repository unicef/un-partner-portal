// @flow weak
/* eslint-disable react/no-multi-comp */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';

import MainContentWrapper from '../../common/mainContentWrapper';
import TabContainer from './tabContainer';

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styleSheet = createStyleSheet(theme => ({
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
}));

const renderTabs = tabs => tabs.map(tab => (
  <TabContainer
    label={tab.label}
    name={tab.name}
  />
));

const renderTabContent = (id, tabsList) => tabsList[id].component;

const PartnerProfileTabs = (props) => {
  const { classes, tabsList, currentTab, onTabClick } = props;
  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        color="inherit"
      >
        <Tabs
          index={currentTab}
          onChange={onTabClick}
          scrollable
          scrollButtons="auto"
        >
          {renderTabs(tabsList, classes.labelStyle)}
        </Tabs>
      </AppBar>
      <MainContentWrapper>
        <Paper className={classes.tabContainer}>
          {renderTabContent(currentTab, tabsList)}
        </Paper>
      </MainContentWrapper>
    </div>
  );
};


PartnerProfileTabs.propTypes = {
  tabsList: PropTypes.arrayOf(PropTypes.objectOf(TabContainer)),
  currentTab: PropTypes.number,
  onTabClick: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(PartnerProfileTabs);
