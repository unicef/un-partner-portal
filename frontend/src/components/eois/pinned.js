import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';

import RegularTable from '../common/table/regularTable';
import { columnData, renderCells } from './overview';
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

const Pinned = () => (

  <Grid container direction="column" gutter={40}>
    <Grid item>
      <EoiFilter />
    </Grid>
    <Grid item>
      <RegularTable
        data={mockData}
        columnData={columnData}
        title={messages.title}
        renderTableCells={renderCells}
      />
    </Grid>
  </Grid>


);

Pinned.PropTypes = {
  classes: PropTypes.object.isRequired,
};

export default Pinned;
