import React from 'react';
import PropTypes from 'prop-types';

import {
  TableCell,
} from 'material-ui/Table';

import EoiPartnersStatusCell from './cells/eoiPartnersStatusCell';
import RegularTable from '../common/table/regularTable';
import EoiSectorCell from './cells/eoiSectorCell';

const columnData = [
  { id: 'name', label: 'Project name' },
  { id: 'agency', label: 'Agency' },
  { id: 'partner', label: 'Partner' },
  { id: 'country', label: 'Country' },
  { id: 'sector', label: 'Sector & Area of specialization' },
  { id: 'source', label: 'Direct Selection Source' },
  { id: 'status', label: 'Status' },
];

const mockData = [
  { name: 'Capacity building for small rural farmers in Kenia', country: 'Kenia', sector: { FoodSecurity: ['Area1', 'Area2'], Nutrition: ['Area1', 'Area2', 'Area3'] }, agency: 'UNICEF', source: 'CSO-Initiated', partner: 'Save the Children', status: { id: 0 } },
  { name: 'Capacity building for small rural farmers in Chile', country: 'Chile', sector: 'Food Security', agency: 'UNICEF', partner: 'Red Cross, Save the Children', source: 'UN-Initiated', status: { id: 0, partner: [{ name: 'Save the Children Kenya', status: 'accepted' }, { name: 'Red Cross Kenya', status: 'pending' }] } },
  { name: 'Capacity building for small rural farmers in Ukraine', country: 'Ukraine', sector: 'Food Security', agency: 'UNICEF', partner: 'Save the Children', source: 'CSO-Initiated', status: { id: 2 } },
  { name: 'Capacity building for small rural farmers in Vietnam', country: 'Vietnam', sector: 'Food Security', agency: 'UNICEF', partner: 'Red Cross', source: 'UN-initiated', status: { id: 1 } },
  { name: 'Capacity building for small rural farmers in Kanada', country: 'Kanada', sector: 'Food Security', agency: 'UNICEF', partner: 'Save the Children', source: 'UN-Initiated', status: { id: 2 } },
];

const renderCells = (item, classes) => ([
  <TableCell className={`${classes.limitedCell} ${classes.firstCell}`}>
    {item.name}
  </TableCell>,
  <TableCell >
    {item.agency}
  </TableCell>,
  <TableCell className={classes.limitedCell} >
    {item.partner}
  </TableCell>,
  <TableCell >
    {item.country}
  </TableCell>,
  <TableCell >
    <EoiSectorCell data={item.sector} id={item.id} />
  </TableCell>,
  <TableCell >
    {item.source}
  </TableCell>,
  <TableCell>
    <EoiPartnersStatusCell status={item.status} id={item.id} />
  </TableCell>,
]);

const Direct = () => (
  <RegularTable
    data={mockData}
    columnData={columnData}
    renderTableCells={renderCells}
  />
);

Direct.PropTypes = {
  classes: PropTypes.object.isRequired,
};

export default Direct;
