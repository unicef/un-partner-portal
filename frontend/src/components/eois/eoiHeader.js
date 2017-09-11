import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';

import Grid from 'material-ui/Grid';
import NewCfeiModalButton from './modals/newCfeiModalButton';
import HeaderNavigation from '../common/headerNavigation';
import { OPEN, PINNED, DIRECT, UNSOLICITED } from '../../helpers/constants';

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
      case OPEN:
      case PINNED:
      case DIRECT:
      case UNSOLICITED:
        return tab.id;
      // TODO: add proper 404
      default:
        history.push('/');
        return null;
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
          {(index !== null) && children}
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

const containerCfeiHeader = connect(
  mapStateToProps,
)(CfeiHeader);

export default containerCfeiHeader;
