import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import CustomTab from '../../common/customTab';
import HeaderNavigation from '../../common/headerNavigation';
import { loadPartnerDetails } from '../../../reducers/partnerProfileDetails';
import Loader from '../../../components/common/loader';

export const emptyMsg = 'There are no changes to be saved.';

export const placeholders = {
  list: 'Please list',
  provide: 'Please provide',
  select: 'Please select',
  explain: 'Briefly explain',
  indicate: 'Please indicate',
  state: 'Please state',
  comment: 'Provide comment',
};

const messages = {
  edit: 'Edit Profile',
  hqProfile: 'Headquarters Profile',
};

const completionTabs = {
  identification: 'identification_is_complete',
  mailing: 'contact_is_complete',
  mandate_mission: 'mandatemission_complete',
  fund: 'funding_complete',
  collaboration: 'collaboration_complete',
  project_impl: 'proj_impl_is_complete',
  otherInformation: 'other_info_is_complete',
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

  componentDidMount() {
    if (!this.props.partnerProfile.identification) {
      this.props.loadPartnerDetails();
    }
  }

  updatePath() {
    if (this.rootContainer) {
      this.rootContainer.scrollIntoView();
    }

    const { tabs, params: { type } } = this.props;
    const index = tabs.findIndex(itab => itab.path === type);
    if (index === -1) {
      // TODO: do real 404
      history.push('/');
    }
    return index;
  }

  partnerProfileTabs() {
    const { tabs, completion } = this.props;

    return tabs.map((tab, index) => <CustomTab label={tab.label} key={index} warn={completion ? !completion[completionTabs[tab.name]] : false} />);
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
      <div ref={(ref) => { this.rootContainer = ref; }}>
        <HeaderNavigation
          index={index}
          subTitle={messages.edit}
          title={countryName}
          customTabs={() => this.partnerProfileTabs()}
          backButton
          handleBackButton={() => { history.goBack(); }}
          handleChange={this.handleChange}
          tabsProps={{ scrollButtons: 'on' }}
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
  children: PropTypes.node,
  params: PropTypes.object,
  countryName: PropTypes.string,
  partnerId: PropTypes.string,
  loadPartnerDetails: PropTypes.func.isRequired,
  partnerProfile: PropTypes.object,
  partnerLoading: PropTypes.bool.isRequired,
  completion: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  const partner = R.find(item => item.id === Number(ownProps.params.id), state.session.partners
    || state.agencyPartnersList.data.partners);
  const basicInfo = R.path(['partnerProfileDetails', 'partnerProfileDetails', 'identification', 'basic'], state);


  return {
    partnerProfile: state.partnerProfileDetails.partnerProfileDetails,
    partnerLoading: state.partnerProfileDetails.detailsStatus.loading,
    countryName: partner.is_hq ? messages.hqProfile : basicInfo ? basicInfo.legal_name : '',
    tabs: state.partnerProfileDetailsNav.tabs,
    partnerId: ownProps.params.id,
    completion: state.partnerProfileDetails.partnerProfileDetails.completion,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onItemClick: (id, path) => {
    history.push(path);
  },
  loadPartnerDetails: () => dispatch(loadPartnerDetails(ownProps.params.id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PartnerProfileEdit);
