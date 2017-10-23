import R from 'ramda';
import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import CustomTab from '../../common/customTab';
import HeaderNavigation from '../../common/headerNavigation';
import { loadPartnerDetails } from '../../../reducers/partnerProfileDetails';
import { loadPartnerProfiles } from '../../../reducers/countryProfiles';

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
    this.props.loadPartnerDetails();
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

    return tabs.map((tab, index) => <CustomTab label={tab.label} key={index} warn={incompleteTabs.includes(tab.name)} />);
  }

  handleChange(event, index) {
    const { tabs, partnerId } = this.props;
    history.push({
      pathname: `/profile/${partnerId}/edit/${tabs[index].path}`,
    });
  }

  render() {
    const { countryName, children, params: { type, id },
    } = this.props;
    const index = this.updatePath();
    return (
      <HeaderNavigation
        index={index}
        subTitle={messages.edit}
        title={countryName}
        customTabs={() => this.partnerProfileTabs()}
        backButton
        handleChange={this.handleChange}
      >
        {(index !== -1) && children}
      </HeaderNavigation>
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
};

const mapStateToProps = (state, ownProps) => {
  let countryProfile = null;
  if (state.countryProfiles.h) {
    countryProfile = R.find(country => country.id === Number(ownProps.params.id),
      state.countryProfiles.hq.country_profiles);
  }

  return {
    countryName: countryProfile ? state.countries[countryProfile.country_code] : messages.hqProfile,
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
