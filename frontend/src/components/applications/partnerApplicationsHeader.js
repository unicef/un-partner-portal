import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import HeaderNavigation from '../common/headerNavigation';
import { PROJECT_TYPES } from '../../helpers/constants';
import NewCfeiModalButton from '../eois/modals/newCfei/newCfeiModalButton';

const messages = {
  applications: 'Your Applications',
  noCfei: 'Sorry but this cfei doesn\'t exist',
};

class PartnerApplicationsHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  updatePath() {
    const { tabs, location } = this.props;

    if (tabs.findIndex(tab => location.match(`^/applications/${tab.path}`)) === -1) {
      history.push('/');
    }

    return tabs.findIndex(tab => location.match(`^/applications/${tab.path}`));
  }

  handleChange(event, index) {
    const { tabs } = this.props;
    history.push(`/applications/${tabs[index].path}`);
  }

  render() {
    const {
      tabs,
      children,
      params: { id },
      location,
    } = this.props;
    const index = this.updatePath();
    return (
      <HeaderNavigation
        index={index}
        title={messages.applications}
        tabs={tabs}
        handleChange={this.handleChange}
        header={!id && location.match('^/applications/unsolicited')
          && <NewCfeiModalButton type={PROJECT_TYPES.UNSOLICITED} />}
        defaultReturn="/"
        backButton
      >
        {children}
      </HeaderNavigation>
    );
  }
}

PartnerApplicationsHeader.propTypes = {
  tabs: PropTypes.array.isRequired,
  children: PropTypes.node,
  location: PropTypes.string,
  params: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  location: ownProps.location.pathname,
  tabs: state.partnerApplicationsNav.tabs,
});

export default connect(
  mapStateToProps,
)(PartnerApplicationsHeader);
