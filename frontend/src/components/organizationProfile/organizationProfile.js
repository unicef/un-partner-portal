import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Paper from 'material-ui/Paper';
import MainContentWrapper from '../../components/common/mainContentWrapper';
import HeaderNavigation from '../../components/common/headerNavigation';
import OrganizationItem from './organizationItem';
import CountryOfficesList from './countryOfficesList';
import { loadPartnerProfiles } from '../../reducers/countryProfiles';
import Loader from '../common/loader';
import { formatDateForPrint } from '../../helpers/dates';
import GridColumn from '../common/grid/gridColumn';

const messages = {
  header: 'Profile',
};

class OrganizationProfile extends Component {
  componentWillMount() {
    this.props.loadPartnerProfiles(this.props.partnerId);
  }

  render() {
    const { countryProfiles, hqProfile, loading, createLoading } = this.props;

    return (
      <React.Fragment>
        <HeaderNavigation title={messages.header}>
          <MainContentWrapper>
            <GridColumn spacing={40}>
              <Paper>
                <OrganizationItem
                  profileId={hqProfile.id}
                  users={hqProfile.users}
                  update={formatDateForPrint(hqProfile.modified)}
                />
              </Paper>
              <CountryOfficesList profiles={countryProfiles} />
            </GridColumn>
          </MainContentWrapper>
        </HeaderNavigation>
        <Loader loading={loading || createLoading} fullscreen />
      </React.Fragment>
    );
  }
}

OrganizationProfile.propTypes = {
  hqProfile: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  createLoading: PropTypes.bool.isRequired,
  partnerId: PropTypes.number.isRequired,
  countryProfiles: PropTypes.array,
  loadPartnerProfiles: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  hqProfile: R.path(['hq'], state.countryProfiles) || {},
  countryProfiles: R.path(['hq', 'country_profiles'], state.countryProfiles) || [],
  partnerId: state.session.partnerId,
  loading: state.countryProfiles.loading,
  createLoading: state.countryProfiles.createLoading,
});

const mapDispatch = dispatch => ({
  loadPartnerProfiles: partnerId => dispatch(loadPartnerProfiles(partnerId, false)),
});

const connectedOrganizationProfile = connect(mapStateToProps, mapDispatch)(OrganizationProfile);
export default withRouter(connectedOrganizationProfile);
