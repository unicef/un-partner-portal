import React from 'react';
import ContentDialog from '../common/contentDialog';
import CountryOfficesHeader from './countryOfficesHeader';
import CountryProfileList from './countryProfile/countryProfileList';
import CountryProfileActions from './countryProfile/countryProfileActions';

const messages = {
  countryDialogTitle: 'Create new country profile',
  countryDialogInfo: 'You have ability to choose from countries selected in HQ Profile as a countries of presence. Disabled options suggest, that those profiles are already created.',
};

const countriesMockData = [
  { id: 1, name: 'Spain', profile: false },
  { id: 2, name: 'Slovenia', profile: false },
  { id: 3, name: 'Czech Republic', profile: false },
  { id: 4, name: 'Portugal', profile: false },
  { id: 5, name: 'Kenya', profile: true },
  { id: 6, name: 'Syria', profile: true },
  { id: 7, name: 'Germany', profile: true },
  { id: 8, name: 'Irland', profile: true },
  { id: 9, name: 'Ukraine', profile: true },
  { id: 10, name: 'England', profile: true },
  { id: 11, name: 'Poland', profile: true },
];

class CountryOfficesHeaderContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCountryModal: false,
      selectedItem: -1,
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
  }

  handleDialogCreate() {
    this.setState({ showCountryModal: false });
  }

  render() {
    return (
      <div>
        <CountryOfficesHeader handleNewCountryClick={this.handleNewCountry} />
        <ContentDialog
          trigger={this.state.showCountryModal}
          title={messages.countryDialogTitle}
          info={messages.countryDialogInfo}
          content={<CountryProfileList countries={countriesMockData} />}
          actions={
            <CountryProfileActions
              close={this.handleDialogClose}
              create={this.handleDialogCreate}
            />}
        />
      </div>
    );
  }
}

export default CountryOfficesHeaderContainer;
