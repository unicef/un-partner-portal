import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import PropTypes from 'prop-types';
import OrganizationProfileOverviewHeader from './organizationProfileOverviewHeader';
import HeaderNavigation from '../../../components/common/headerNavigation';

const messages = {
  hqProfile: 'Headquarters Profile',
};

class OrganizationProfileHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  updatePath() {
    const { tabs, location, partnerId } = this.props;

    if (tabs.findIndex(tab => location.match(`^/profile/${partnerId}/${tab.path}`) || location.match(`profile/${partnerId}/${tab.path}`)) === -1) {
      history.push('/');
    }

    return tabs.findIndex(tab => location.match(`^/profile/${partnerId}/${tab.path}`) || location.match(`profile/${partnerId}/${tab.path}`));
  }

  handleChange(event, index) {
    const { tabs, partnerId } = this.props;
    history.push(`/profile/${partnerId}/${tabs[index].path}`);
  }

  render() {
    const {
      tabs,
      children,
      partnerId,
      countryName,
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
          header={<OrganizationProfileOverviewHeader
            update="12 Aug 2017"
            handleEditClick={() => { history.push(`/profile/${partnerId}/edit`); }}
            partnerId={partnerId}
          />}
          title={countryName}
          handleChange={this.handleChange}
        />
      </div>
    );
  }
}

OrganizationProfileHeader.propTypes = {
  tabs: PropTypes.array.isRequired,
  children: PropTypes.node,
  countryName: PropTypes.string,
  location: PropTypes.string.isRequired,
  partnerId: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const partner = R.find(item => item.id === Number(ownProps.params.id), state.session.partners
    || state.agencyPartnersList.data.partners);
  const basicInfo = R.path(['partnerProfileDetails', 'partnerProfileDetails', 'identification', 'basic'], state);

  return {
    countryName: partner.is_hq ? messages.hqProfile : basicInfo ? basicInfo.legal_name : '',
    partnerId: ownProps.params.id,
    location: ownProps.location.pathname,
    tabs: state.organizationProfileNav,
  };
};

const mapDispatchToProps = () => ({
  onItemClick: (id, path) => {
    history.push(path);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationProfileHeader);

