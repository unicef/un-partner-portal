import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import PropTypes from 'prop-types';
import OrganizationProfileOverviewHeader from './organizationProfileOverviewHeader';
import HeaderNavigation from '../../../components/common/headerNavigation';

class OrganizationProfileHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  updatePath() {
    const { tabs, location, countryCode } = this.props; 
    if (tabs.findIndex(tab => location.match(`^/profile/${countryCode}/${tab.path}`)) === -1) {
      history.push('/');
    }

    return tabs.findIndex(tab => location.match(`^/profile/${countryCode}/${tab.path}`));
  }

  handleChange(event, index) {
    const { tabs, countryCode } = this.props;
    history.push(`/profile/${countryCode}/${tabs[index].path}`);
  }

  render() {
    const {
      tabs,
      children,
      profile,
      countryCode,
    } = this.props;

    const index = this.updatePath();

    return (
      <div>
        <HeaderNavigation
          backButton
          tabs={tabs}
          index={index}
          children={children}
          handleBackButton={() => { history.goBack(); }}
          header={<OrganizationProfileOverviewHeader update="12 Aug 2017" handleEditClick={() => { history.push(`/profile/${countryCode}/edit`); }} />}
          title={profile.name}
          handleChange={this.handleChange}
        />
      </div>
    );
  }
}

OrganizationProfileHeader.propTypes = {
  tabs: PropTypes.array.isRequired,
  children: PropTypes.node,
  profile: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  profile: state.organizationProfile[ownProps.params.countryCode],
  countryCode: ownProps.params.countryCode,
  location: ownProps.location.pathname,
  tabs: state.organizationProfileNav,
});

const mapDispatchToProps = () => ({
  onItemClick: (id, path) => {
    history.push(path);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationProfileHeader);

