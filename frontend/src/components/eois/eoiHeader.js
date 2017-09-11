import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Tabs from 'material-ui/Tabs';
import CustomTab from '../common/customTab';
import NewCfeiModalButton from './modals/newCfeiModalButton';
import HeaderNavigation from '../common/headerNavigation';

const messages = {
  partner: 'Calls for Expressions of Interest',
  agency: 'Expression of Interests',
};

class CfeiHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  updatePath() {
    const { tabs, params: { type } } = this.props;
    if (!type) return history.push(`/cfei/${tabs[0].path}`);
    const tab = tabs.find(itab => itab.path === type);
    switch (type) {
      case 'open':
      case 'pinned':
      case 'direct':
      case 'unsolicited':
        return tab.id;
      // TODO: add proper 404
      default:
        return history.replace('/');
    }
  }

  handleChange(event, index) {
    const { tabs } = this.props;
    history.push(`/cfei/${tabs[index].path}`);
  }

  render() {
    const {
      tabs,
      children,
      role,
      params: { type, id },
    } = this.props;
    const index = this.updatePath();
    return (
      <Grid item>
        <HeaderNavigation
          index={index}
          title={messages[role]}
          tabs={tabs}
          header={!id && type && role === 'agency' && <NewCfeiModalButton />}
          handleChange={this.handleChange}
        >
          {children}
        </HeaderNavigation>
      </Grid>
    );
  }
}

CfeiHeader.propTypes = {
  tabs: PropTypes.array.isRequired,
  children: PropTypes.node,
  role: PropTypes.string,
  params: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  location: ownProps.location.pathname,
  tabs: state.cfeiNav,
  role: state.session.role,
});

const mapDispatchToProps = dispatch => ({
  onTabChange: index => dispatch(ActiveItem(index)),
});

const containerCfeiHeader = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CfeiHeader);

export default containerCfeiHeader;
