import React from 'react';
import TableCell from './tableCell';
import EoiSectorCell from './eoiSectorCell';
import EoiPartnersStatusCell from './eoiPartnersStatusCell';
import EoiStatusCell from './eoiStatusCell';
import EoiCountryCell from './eoiCountryCell';

export const renderPartnerOpenCells = item => ([
  <TableCell first limited>
    {item.title}
  </TableCell>,
  <TableCell >
    <EoiCountryCell code={item.country_code} />
  </TableCell>,
  <TableCell >
    <EoiSectorCell data={item.sectors} id={item.id} />
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
  <TableCell first limited>
    {item.title}
  </TableCell>,
  <TableCell >
    {item.agency.name}
  </TableCell>,
  <TableCell >
    <EoiCountryCell code={item.country_code} />
  </TableCell>,
  <TableCell >
    <EoiSectorCell data={item.sectors} id={item.id} />
  </TableCell>,
  <TableCell >
    {item.start_date}
  </TableCell>,
  <TableCell >
    {item.deadline_date}
  </TableCell>,
  <TableCell>
    <EoiStatusCell id={item.status} />
  </TableCell>,
]);

export const renderAgencyDirectCells = item => ([
  <TableCell first limited>
    {item.name}
  </TableCell>,
  <TableCell >
    {item.agency}
  </TableCell>,
  <TableCell limited >
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
