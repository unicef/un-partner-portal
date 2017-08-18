import React from 'react';
import PropTypes from 'prop-types';
import {
  TableCell,
} from 'material-ui/Table';

import PinHeaderIcon from './icons/pinHeaderIcon';
import EoiStatusWithIconsCell from './cells/eoiStatusWithIconsCell';
import SelectableTable from '../common/table/selectableTable';

const messages = {
  title: 'List of Calls for Expressions of Interest',
  tooltip: 'Pin CFEI',
};


export const columnData = [
  { id: 'name', label: 'Project name' },
  { id: 'country', label: 'Country' },
  { id: 'sector', label: 'Sector' },
  { id: 'area', label: 'Area of specialization' },
  { id: 'agency', label: 'Agency' },
  { id: 'deadline', label: 'Application deadline' },
  { id: 'startDate', label: 'Project start date' },
  { id: 'status', label: 'Status' },
];

const mockData = [
  { name: 'Capacity building for small rural farmers in Kenia', country: 'Kenia', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '01 Jan 2016', startDate: '30 Sep 2017', status: 0, pinned: true },
  { name: 'Capacity building for small rural farmers in Chile', country: 'Chile', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '04 Mar 2017', startDate: '30 Sep 2017', status: 0, pinned: false },
  { name: 'Capacity building for small rural farmers in Ukraine', country: 'Ukraine', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '30 Jun 1994', startDate: '30 Sep 2017', status: 2, pinned: true },
  { name: 'Capacity building for small rural farmers in Vietnam', country: 'Vietnam', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '30 Jun 2018', startDate: '30 Sep 2017', status: 1, pinned: true },
  { name: 'Capacity building for small rural farmers in Kanada', country: 'Kanada', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '29 Jun 2017', startDate: '30 Sep 2017', status: 2, pinned: false },
];

const renderCells = (item, classes, hoverOn) => ([
  <TableCell className={`${classes.limitedCell}`}>
    {item.name}
  </TableCell>,
  <TableCell >
    {item.country}
  </TableCell>,
  <TableCell >
    {item.sector}
  </TableCell>,
  <TableCell >
    {item.area}
  </TableCell>,
  <TableCell >
    {item.agency}
  </TableCell>,
  <TableCell >
    {item.deadline}
  </TableCell>,
  <TableCell >
    {item.startDate}
  </TableCell>,
  <TableCell >
    <EoiStatusWithIconsCell
      item={item}
      hoverOn={hoverOn}
      message={messages.tooltip}
    />
  </TableCell>,
]);

const Overview = () => (
  <SelectableTable
    data={mockData}
    columnData={columnData}
    title={messages.title}
    renderTableCells={renderCells}
    toolbarIcons={<PinHeaderIcon />}
  />
);

Overview.PropTypes = {
  classes: PropTypes.object.isRequired,
};

export default Overview;
