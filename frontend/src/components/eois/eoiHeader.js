import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';

import Grid from 'material-ui/Grid';
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
    const index = tabs.findIndex(itab => itab.path === type);
    if (index === -1) {
      // TODO: do real 404
      history.push('/');
    }
    return index;
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
          {(index !== -1) && children}
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
