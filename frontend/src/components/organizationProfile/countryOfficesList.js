import React from 'react';
import HeaderList from '../../components/common/list/headerList';
import OrganizationItem from './organizationItem';
import CountryOfficesHeaderContainer from './countryOfficesHeaderContainer';

const countryItemsMockData = [
  { country: 'Kenya', users: 25, update: '01 Jan 2016', completed: true },
  { country: 'Syria', users: 1, update: '03 Jan 2017', completed: true },
  { country: 'Germany', users: 2, update: '1 Dec 2015', completed: false },
  { country: 'Irland', users: 2, update: '1 Aug 2016', completed: true },
  { country: 'Ukraine', users: 2, update: '01 Aug 2016', completed: false },
  { country: 'England', users: 2, update: '1 Aug 2016', completed: false },
  { country: 'Poland', users: 105, update: '01 Aug 2017', completed: true },
];

const countryOfficesItems = () => countryItemsMockData.map(item =>
  (<OrganizationItem
    isCountryItem
    title={item.country}
    users={item.users}
    update={item.update}
    completed={item.completed}
  />));

const CountryOfficesList = () => (
  <HeaderList
    header={CountryOfficesHeaderContainer}
    rows={countryOfficesItems(countryItemsMockData)}
  />
);

export default CountryOfficesList;
