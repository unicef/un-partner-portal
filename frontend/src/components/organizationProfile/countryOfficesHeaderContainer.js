import R from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ControlledModal from '../common/modals/controlledModal';
import CountryOfficesHeader from './countryOfficesHeader';
import CountryProfileList from './countryProfile/countryProfileList';
import { selectCountryId, createCountryProfile, INIT_COUNTRY_ID } from '../../reducers/countryProfiles';

const messages = {
  countryDialogTitle: 'Create new country profile',
  countryDialogInfo: 'You have ability to choose from countries selected in HQ Profile as a countries of presence. Disabled options suggest, that those profiles are already created.',
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
    this.props.setSelectedCountryId(INIT_COUNTRY_ID);
  }

  handleDialogCreate() {
    this.setState({ showCountryModal: false });

    if (this.props.selectedCountryId !== INIT_COUNTRY_ID) {
      this.props.createCountryProfile();
      this.props.setSelectedCountryId(INIT_COUNTRY_ID);
    }
  }

  render() {
    const { countryPresence, countryProfiles } = this.props;

    return (
      <div>
        <CountryOfficesHeader handleNewCountryClick={this.handleNewCountry} />
        <ControlledModal
          trigger={this.state.showCountryModal}
          title={messages.countryDialogTitle}
          info={{ title: messages.countryDialogInfo }}
          content={<CountryProfileList countries={R.concat(countryPresence, countryProfiles)} />}
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
  createCountryProfile: PropTypes.func.isRequired,
  selectedCountryId: PropTypes.number.isRequired,
};

const mapDispatch = dispatch => ({
  setSelectedCountryId: countryId => dispatch(selectCountryId(countryId)),
  createCountryProfile: () => dispatch(createCountryProfile()),
});

const mapStateToProps = state => ({
  countryProfiles: state.countryProfiles.countryProfiles,
  countryPresence: state.countryProfiles.countryPresence,
  selectedCountryId: state.countryProfiles.selectedCountryId,
});

export default connect(mapStateToProps, mapDispatch)(CountryOfficesHeaderContainer);
