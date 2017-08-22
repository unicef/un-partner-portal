import React from 'react';
import PropTypes from 'prop-types';
import {
  TableCell,
} from 'material-ui/Table';
import Grid from 'material-ui/Grid';

import PinHeaderIcon from './icons/pinHeaderIcon';
import EoiStatusWithIconsCell from './cells/eoiStatusWithIconsCell';
import SelectableTable from '../common/table/selectableTable';
import EoiSectorCell from './cells/eoiSectorCell';
import { columnData } from './overview';
import EoiFilter from './filters/eoiFilter';

const messages = {
  title: 'List of Calls for Expressions of Interest',
  tooltip: 'remove pin',
};

const mockData = [
  { name: 'Capacity building for small rural farmers in Kenia', country: 'Kenia', sector: { FoodSecurity: ['Area1', 'Area2'] }, agency: 'UNICEF', deadline: '01 Jan 2016', startDate: '30 Sep 2017', status: 0, pinned: true },
  { name: 'Capacity building for small rural farmers in Chile', country: 'Chile', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '04 Mar 2017', startDate: '30 Sep 2017', status: 0, pinned: true },
  { name: 'Capacity building for small rural farmers in Ukraine', country: 'Ukraine', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '30 Jun 1994', startDate: '30 Sep 2017', status: 2, pinned: true },
  { name: 'Capacity building for small rural farmers in Vietnam', country: 'Vietnam', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '30 Jun 2018', startDate: '30 Sep 2017', status: 1, pinned: true },
  { name: 'Capacity building for small rural farmers in Kanada', country: 'Kanada', sector: 'Food Security', area: 'Agriculture Inputs', agency: 'UNICEF', deadline: '29 Jun 2017', startDate: '30 Sep 2017', status: 2, pinned: true },
];

const renderCells = (item, classes, hoverOn) => ([
  <TableCell className={`${classes.limitedCell}`}>
    {item.name}
  </TableCell>,
  <TableCell >
    {item.country}
  </TableCell>,
  <TableCell >
    <EoiSectorCell data={item.sector} id={item.id} />
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
      simple
    />
  </TableCell>,
]);

const Pinned = () => (

  <Grid container direction="column" gutter={40}>
    <Grid item>
      <EoiFilter />
    </Grid>
    <Grid item>
      <SelectableTable
        data={mockData}
        columnData={columnData}
        title={messages.title}
        renderTableCells={renderCells}
        toolbarIcons={<PinHeaderIcon />}
      />
    </Grid>
  </Grid>


);

Pinned.PropTypes = {
  classes: PropTypes.object.isRequired,
};

export default Pinned;
