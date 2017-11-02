import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import CustomTab from '../../common/customTab';
import HeaderNavigation from '../../common/headerNavigation';
import { loadPartnerDetails } from '../../../reducers/partnerProfileDetails';
import Loader from '../../../components/common/loader';

const messages = {
  edit: 'Edit Profile',
  hqProfile: 'HQ Profile',
};

class PartnerProfileEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.partnerProfileTabs = this.partnerProfileTabs.bind(this);
  }

  componentWillMount() {
    if (!this.props.partnerProfile.identification) {
      this.props.loadPartnerDetails();
    }
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

  partnerProfileTabs() {
    const { tabs, incompleteTabs } = this.props;

    return tabs.map((tab, index) =>
      <CustomTab label={tab.label} key={index} warn={incompleteTabs.includes(tab.name)} />,
    );
  }

  handleChange(event, index) {
    const { tabs, partnerId } = this.props;
    history.push({
      pathname: `/profile/${partnerId}/edit/${tabs[index].path}`,
    });
  }

  render() {
    const { countryName, partnerLoading, children, params: { type, id },
    } = this.props;

    const index = this.updatePath();
    return (
      <div>
        <HeaderNavigation
          index={index}
          subTitle={messages.edit}
          title={countryName}
          customTabs={() => this.partnerProfileTabs()}
          backButton
          handleBackButton={() => { history.goBack(); }}
          handleChange={this.handleChange}
        >
          {(index !== -1) && children}
        </HeaderNavigation>
        <Loader loading={partnerLoading} fullscreen />
      </div>
    );
  }
}

PartnerProfileEdit.propTypes = {
  tabs: PropTypes.array.isRequired,
  incompleteTabs: PropTypes.array,
  children: PropTypes.node,
  params: PropTypes.object,
  countryName: PropTypes.string,
  partnerId: PropTypes.string,
  loadPartnerDetails: PropTypes.func.isRequired,
  partnerProfile: PropTypes.object,
  partnerLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const partner = R.find(item => item.id === Number(ownProps.params.id), state.session.partners || state.agencyPartnersList.partners);
  
  return {
    partnerProfile: state.partnerProfileDetails.partnerProfileDetails,
    partnerLoading: state.partnerProfileDetails.detailsStatus.loading,
    countryName: partner.is_hq ? messages.hqProfile : state.countries[partner.country_code],
    tabs: state.partnerProfileDetailsNav.tabs,
    partnerId: ownProps.params.id,
    incompleteTabs: state.partnerProfileEdit.incompleteTabs,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onItemClick: (id, path) => {
    history.push(path);
  },
  loadPartnerDetails: () => dispatch(loadPartnerDetails(ownProps.params.id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PartnerProfileEdit);
