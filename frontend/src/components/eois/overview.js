
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import { TableCell } from 'material-ui/Table';

import SelectableTable from '../common/table/selectableTable';


const messages = {
  title: 'List of Calls for Expressions of Interest',
};

const createData = data => data.map((item, index) => ({ id: index, ...item }));

const columnData = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Project name' },
  { id: 'country', numeric: false, disablePadding: false, label: 'Country' },
  { id: 'sector', numeric: false, disablePadding: false, label: 'Sector' },
  { id: 'area', numeric: false, disablePadding: false, label: 'Area of specialization' },
  { id: 'agency', numeric: false, disablePadding: false, label: 'Agency' },
  { id: 'deadline', numeric: false, disablePadding: false, label: 'Application deadline' },
  { id: 'startDate', numeric: false, disablePadding: false, label: 'Project start date' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
];

const STATUSES = [
  'Open',
  'Closed',
  'Completed',
];

const mockData = [
  { name: 'Capacity building for small rural farmers in Kenia', country: 'Kenia', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '01 Jan 2016', startDate: '30 Sep 2017', status: 0 },
  { name: 'Capacity building for small rural farmers in Chile', country: 'Chile', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '04 Mar 2017', startDate: '30 Sep 2017', status: 0 },
  { name: 'Capacity building for small rural farmers in Ukraine', country: 'Ukraine', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '30 Jun 1994', startDate: '30 Sep 2017', status: 2 },
  { name: 'Capacity building for small rural farmers in Vietnam', country: 'Vietnam', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '30 Jun 2018', startDate: '30 Sep 2017', status: 1 },
  { name: 'Capacity building for small rural farmers in Kanada', country: 'Kanada', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '29 Jun 2017', startDate: '30 Sep 2017', status: 2 },
];

const styleSheet = createStyleSheet(theme => ({
  root: {
    background: theme.palette.primary[200],
    padding: theme.spacing.unit * 3,
  },
  paper: {
    width: '100%',
    overflowX: 'scroll',
  },

  limitedCell: {
    maxWidth: 250,
  },
}));

const renderTableCells = (n, state, classes) => [
  <TableCell className={classes.limitedCell + (state.selectable ? '' : ` ${classes.firstCell}`)}>
    {n.name}
  </TableCell>,
  <TableCell >
    {n.country}
  </TableCell>,
  <TableCell >
    {n.sector}
  </TableCell>,
  <TableCell >
    {n.area}
  </TableCell>,
  <TableCell >
    {n.agency}
  </TableCell>,
  <TableCell >
    {n.deadline}
  </TableCell>,
  <TableCell >
    {n.startDate}
  </TableCell>,
  <TableCell >
    {(state.hoverOn === n.id) ? 'Icon' : STATUSES[n.status]}
  </TableCell>,
];


const Overview = () => (
  <SelectableTable
    data={createData(mockData)}
    columnData={columnData}
    renderCells={renderTableCells}
    title={messages.title}
  />
);

Overview.PropTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Overview);
