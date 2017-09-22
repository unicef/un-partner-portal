import React from 'react';
import TableCell from './tableCell';
import EoiSectorCell from './eoiSectorCell';
import EoiPartnersStatusCell from './eoiPartnersStatusCell';
import EoiStatusCell from './eoiStatusCell';
import EoiCountryCell from './eoiCountryCell';
import EoiPartnersCell from './eoiPartnersCell';
import EoiNameCell from './eoiNameCell';

export const renderPartnerOpenCells = item => ([
  <EoiNameCell title={item.title} id={item.id} />,
  <TableCell >
    <EoiCountryCell code={item.country_code} />
  </TableCell>,
  <TableCell >
    <EoiSectorCell data={item.specializations} id={item.id} />
  </TableCell>,
  <TableCell >
    {item.agency.name}
  </TableCell>,
  <TableCell >
    {item.deadline_date}
  </TableCell>,
  <TableCell >
    {item.start_date}
  </TableCell>,
]);

export const renderAgencyOpenCells = item => ([
  <EoiNameCell title={item.title} id={item.id} />,
  <TableCell >
    {item.agency.name}
  </TableCell>,
  <TableCell >
    <EoiCountryCell code={item.country_code} />
  </TableCell>,
  <TableCell >
    <EoiSectorCell data={item.specializations} id={item.id} />
  </TableCell>,
  <TableCell >
    {item.created}
  </TableCell>,
  <TableCell >
    {item.deadline_date}
  </TableCell>,
  <TableCell>
    <EoiStatusCell id={item.status} />
  </TableCell>,
]);

export const renderAgencyDirectCells = item => ([
  <EoiNameCell title={item.title} id={item.id} />,
  <TableCell >
    {item.agency.name}
  </TableCell>,
  <TableCell limited >
    <EoiPartnersCell partners={item.selected_partners} />
  </TableCell>,
  <TableCell >
    <EoiCountryCell code={item.country_code} />
  </TableCell>,
  <TableCell >
    <EoiSectorCell data={item.specializations} id={item.id} />
  </TableCell>,
  <TableCell >
    {item.selected_source}
  </TableCell>,
  <TableCell>
    <EoiPartnersStatusCell
      status={item.status}
      id={item.id}
      partners={item.selected_partners}
    />
  </TableCell>,
]);
