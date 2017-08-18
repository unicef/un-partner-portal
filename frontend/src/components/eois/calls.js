import React from 'react';
import PropTypes from 'prop-types';

import AgencyEoiTable from './agencyEoiTable';
import PinIcon from '../common/pinIcon';
import TooltipIcon from '../common/tooltipIcon';
import {
  TableCell,
} from 'material-ui/Table';

import PinHeaderIcon from './icons/pinHeaderIcon';
import EoiStatusWithIconsCell from './cells/eoiStatusWithIconsCell';
import RegularTable from '../common/table/regularTable';
import EoiSectorCell from './cells/eoiSectorCell';
import EoiStatusCell from './cells/eoiStatusCell';

const createData = data => data.map((item, index) => ({ id: index, ...item }));

const columnData = [
  { id: 'name', label: 'Project name' },
  { id: 'agency', label: 'Agency' },
  { id: 'country', label: 'Country' },
  { id: 'sector', label: 'Sector & Area of specialization' },
  { id: 'datePosted', label: 'Date Posted' },
  { id: 'deadline', label: 'Application deadline' },
  { id: 'status', label: 'Status' },
];

const mockData = [
  { name: 'Capacity building for small rural farmers in Kenia', country: 'Kenia', sector: { FoodSecurity: ['Area1', 'Area2'], Nutrition: ['Area1', 'Area2', 'Area3'] }, agency: 'UNICEF', deadline: '01 Jan 2016', datePosted: '30 Sep 2017', status: 0, pinned: true },
  { name: 'Capacity building for small rural farmers in Chile', country: 'Chile', sector: 'Food Security', agency: 'UNICEF', deadline: '04 Mar 2017', datePosted: '30 Sep 2017', status: 0, pinned: false },
  { name: 'Capacity building for small rural farmers in Ukraine', country: 'Ukraine', sector: 'Food Security', agency: 'UNICEF', deadline: '30 Jun 1994', datePosted: '30 Sep 2017', status: 2, pinned: true },
  { name: 'Capacity building for small rural farmers in Vietnam', country: 'Vietnam', sector: 'Food Security', agency: 'UNICEF', deadline: '30 Jun 2018', datePosted: '30 Sep 2017', status: 1, pinned: true },
  { name: 'Capacity building for small rural farmers in Kanada', country: 'Kanada', sector: 'Food Security', agency: 'UNICEF', deadline: '29 Jun 2017', datePosted: '30 Sep 2017', status: 2, pinned: false },
];

const renderCells = (item, classes) => ([
  <TableCell className={`${classes.limitedCell} ${classes.firstCell}`}>
    {item.name}
  </TableCell>,
  <TableCell >
    {item.agency}
  </TableCell>,
  <TableCell >
    {item.country}
  </TableCell>,
  <TableCell >
    <EoiSectorCell data={item.sector} />
  </TableCell>,
  <TableCell >
    {item.datePosted}
  </TableCell>,
  <TableCell >
    {item.deadline}
  </TableCell>,
  <TableCell>
    <EoiStatusCell id={item.status} />
  </TableCell>,
]);

const Calls = () => (
  <RegularTable
    data={mockData}
    columnData={columnData}
    renderTableCells={renderCells}
  />
);

Calls.PropTypes = {
  classes: PropTypes.object.isRequired,
};

export default Calls;
