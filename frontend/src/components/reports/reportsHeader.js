import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';

import HeaderNavigation from '../common/headerNavigation';

const messages = {
  partner: 'Calls for Expressions of Interest',
  agency: 'Expressions of Interest',
};

class ReportsHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  updatePath() {
    const { tabs, location } = this.props;

    if (tabs.findIndex(tab => location.match(`^/reports/${tab.path}`)) === -1) {
      history.push('/');
    }

    return tabs.findIndex(tab => location.match(`^/reports/${tab.path}`));
  }

  handleChange(event, index) {
    const { tabs, location } = this.props;
    history.push({
      pathname: `/reports/${tabs[index].path}`,
      query: location.query,
    });
  }

  render() {
    const {
      tabs,
      children,
    } = this.props;
    const index = this.updatePath();

    return (
      <HeaderNavigation
        index={index}
        title={messages.agency}
        tabs={tabs}

        handleChange={this.handleChange}
      >
        {(index !== -1) && children}
      </HeaderNavigation>
    );
  }
}

ReportsHeader.propTypes = {
  tabs: PropTypes.array.isRequired,
  children: PropTypes.node,
  location: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  location: ownProps.location.pathname,
  tabs: state.reportsNav,
  role: state.session.role,
});

const containerCfeiHeader = connect(
  mapStateToProps,
)(ReportsHeader);

export default containerCfeiHeader;
