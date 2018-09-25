import React from 'react';
import { pluck } from 'ramda';
import { TableCell } from 'material-ui/Table';
import EoiSectorCell from './eoiSectorCell';
import EoiPartnersStatusCell from './eoiPartnersStatusCell';
import EoiStatusCell from './eoiStatusCell';
import EoiNameCell from './eoiNameCell';
import IsDirectCell from './isDirectCell';
import CountriesCell from '../../partners/countriesCell';
import EoiDSPartnersCell from './eoiDSPartnersCell';
import { formatDateForPrint } from '../../../helpers/dates';
import EoiFocalPointCell from './eoiFocalPointCell';
import EoiAgencyFocalCell from './eoiAgencyFocalCell';
import CountriesCellCfeiID from '../../partners/countriesCellCfeiID';

export default type => ({ row, column, value }) => {
  if (column.name === 'focal_points') {
    return (<TableCell padding="dense">
      <EoiFocalPointCell data={row.focal_points} id={row.id} />
    </TableCell>);
  } else if (column.name === 'title' || column.name === 'project_title') {
    return <EoiNameCell title={row.title || row.project_title} id={`${row.id}`} />;
  } else if (column.name === 'country_code') {
    return (
      <CountriesCell countries={row.country_code} />
    );
  } else if (column.name === 'country_code_cfei') {
    return (
      <CountriesCellCfeiID countries={row.country_code} cfeiID={row.displayID} />
    );
  } else if (column.name === 'specializations') {
    return (
      <TableCell padding="dense" >
        <EoiSectorCell data={row.specializations} id={row.id} />
      </TableCell>);
  } else if (column.name === 'agency') {
    return (
      <TableCell padding="dense">
        {row.agency.name}
      </TableCell>);
  } else if (column.name === 'agency_focal') {
    return <TableCell padding="dense" >
      <EoiAgencyFocalCell agency={row.agency.name} focalPoints={row.focal_points} />
    </TableCell>;
  } else if (column.name === 'status' && type === 'open') {
    return (
      <TableCell >
        <EoiStatusCell status={row.status} />
      </TableCell>);
  } else if (column.name === 'status' && type === 'direct') {
    return (
      <TableCell >
        <EoiPartnersStatusCell
          status={row.status}
          id={row.id}
          partners={row.partner_offer_status}
        />
      </TableCell>);
  } else if (column.name === 'selected_partners') {
    return (
      <TableCell >
        <EoiDSPartnersCell
          partners={pluck('legal_name', row.partner_offer_status || [])}
          id={row.id}
        />
      </TableCell>);
  } else if (column.name === 'submission_date') {
    return (
      <TableCell >
        {row.submission_date ? formatDateForPrint(row.submission_date) : '-'}
      </TableCell>);
  } else if (column.name === 'created') {
    return (
      <TableCell >
        {formatDateForPrint(row.created)}
      </TableCell>);
  } else if (column.name === 'deadline_date') {
    return (
      <TableCell >
        {formatDateForPrint(row.deadline_date)}
      </TableCell>);
  } else if (column.name === 'start_date') {
    return (
      <TableCell >
        {formatDateForPrint(row.start_date)}
      </TableCell>);
  } else if (column.name === 'is_direct') {
    return (
      <TableCell >
        <IsDirectCell isDirect={row.is_direct} />
      </TableCell>);
  }

  return <TableCell>{value}</TableCell>;
};
