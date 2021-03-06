import R from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ControlledModal from '../common/modals/controlledModal';
import CountryOfficesHeader from './countryOfficesHeader';
import CountryProfileList from './countryProfile/countryProfileList';
import { selectCountryId, createCountryAndRefresh } from '../../reducers/countryProfiles';

const messages = {
  countryDialogTitle: 'Create new a country profile',
  countryDialogInfo: 'You can grant access to your organization\'s country offices. If your organization has a country office in a country that is not shown below, you must first add that country in your headquarters profile.',
  create: 'Create',
};

class CountryOfficesHeaderContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCountryModal: false,
    };

    this.handleNewCountry = this.handleNewCountry.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogCreate = this.handleDialogCreate.bind(this);
  }

  handleNewCountry() {
    this.setState({ showCountryModal: true });
  }

  handleDialogClose() {
    this.setState({ showCountryModal: false });
    this.props.setSelectedCountryId(null);
  }

  handleDialogCreate() {
    this.setState({ showCountryModal: false });

    if (!R.isEmpty(this.props.selectedCountries)) {
      this.props.newCountryProfiles(this.props.partnerId, this.props.selectedCountries);
      this.props.setSelectedCountryId(null);
    }
  }

  mergeCountryProfiles() {
    const { countryPresence, countryProfiles } = this.props;

    const filteredOutCreatedProfiles = R.filter(presenceCode =>
      R.isEmpty(R.filter(profile =>
        profile.country_code === presenceCode, countryProfiles)), countryPresence);

    return R.concat(filteredOutCreatedProfiles, countryProfiles);
  }

  render() {
    return (
      <div style={{ display: 'flex', width: '100%' }}>
        <CountryOfficesHeader
          disableNewCountries={this.props.disableNewCountries}
          handleNewCountryClick={this.handleNewCountry}
        />
        <ControlledModal
          trigger={this.state.showCountryModal}
          title={messages.countryDialogTitle}
          info={{ title: messages.countryDialogInfo }}
          handleDialogClose={this.handleDialogClose}
          content={<CountryProfileList countries={this.mergeCountryProfiles()} />}
          buttons={{
            flat: {
              handleClick: this.handleDialogClose,
            },
            raised: {
              handleClick: this.handleDialogCreate,
              label: messages.create,
            },
          }}
        />
      </div>
    );
  }
}

CountryOfficesHeaderContainer.propTypes = {
  countryProfiles: PropTypes.array.isRequired,
  countryPresence: PropTypes.array.isRequired,
  setSelectedCountryId: PropTypes.func.isRequired,
  newCountryProfiles: PropTypes.func.isRequired,
  selectedCountries: PropTypes.array.isRequired,
  partnerId: PropTypes.number.isRequired,
  disableNewCountries: PropTypes.bool,
};

const mapDispatch = dispatch => ({
  setSelectedCountryId: countryId => dispatch(selectCountryId(countryId)),
  newCountryProfiles: (partnerId, countryId) => dispatch(createCountryAndRefresh(partnerId, countryId)),
});

const mapStateToProps = state => ({
  countryProfiles: R.path(['hq', 'country_profiles'], state.countryProfiles) || [],
  countryPresence: R.path(['hq', 'country_presence'], state.countryProfiles) || [],
  selectedCountries: state.countryProfiles.selectedCountries,
  partnerId: state.session.partnerId,
  disableNewCountries: !state.session.isProfileComplete,
});

export default connect(mapStateToProps, mapDispatch)(CountryOfficesHeaderContainer);
