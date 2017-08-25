import React, { Component } from 'react';
import HeaderList from '../../components/common/list/headerList';
import CountryProfileItem from './countryProfileItem';
import CountryOfficesHeader from './countryOfficesHeader';

const countryItemsMockData = [
  { country: 'Kenya', users: 25, update: '01 Jan 2016', completed: true },
  { country: 'Syria', users: 1, update: '03 Jan 2017', completed: false },
  { country: 'Ukraine', users: 2, update: '01 Aug 2016', completed: false },
  { country: 'Poland', users: 105, update: '01 Aug 2017', completed: true },
];

const countryOfficesItems = () => countryItemsMockData.map(item =>
  (<CountryProfileItem
    country={item.country}
    users={item.users}
    update={item.update}
    completed={item.completed}
  />));

class CountryOfficesListTmp extends Component {
  render() {
    return (
      <HeaderList header={CountryOfficesHeader} rows={countryOfficesItems(countryItemsMockData)} />
    );
  }
}

export default CountryOfficesListTmp;
