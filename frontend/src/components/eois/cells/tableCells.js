import React from 'react';
import { TableCell } from 'material-ui/Table';
import EoiSectorCell from './eoiSectorCell';
import EoiPartnersStatusCell from './eoiPartnersStatusCell';
import EoiStatusCell from './eoiStatusCell';
import EoiCountryCell from './eoiCountryCell';
import EoiPartnersCell from './eoiPartnersCell';
import EoiNameCell from './eoiNameCell';
import IsDirectCell from './isDirectCell';
import { formatDateForPrint } from '../../../helpers/dates';

export default type => ({ row, column }) => {
  if (column.name === 'title' || column.name === 'project_title') {
    return <EoiNameCell title={row.title || row.project_title} id={row.id} />;
  } else if (column.name === 'country_code') {
    return (
      <TableCell >
        {row.country_code.map((code, index) =>
          (<span>
            <EoiCountryCell code={code} />
            {(index === row.county_code.length - 1) ? '' : ', '}
          </span>),
        )}
      </TableCell>);
  } else if (column.name === 'specializations') {
    return (
      <TableCell >
        <EoiSectorCell data={row.specializations} id={row.id} />
      </TableCell>);
  } else if (column.name === 'agency') {
    return (
      <TableCell >
        {row.agency.name}
      </TableCell>);
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
        <EoiPartnersCell partners={row.invited_partners || []} />
      </TableCell>);
  } else if (column.name === 'submission_date') {
    return (
      <TableCell >
        {formatDateForPrint(row.submission_date)}
      </TableCell>);
  } else if (column.name === 'is_direct') {
    return (
      <TableCell >
        <IsDirectCell isDirect={row.is_direct} />
      </TableCell>);
  }

  return undefined;
};
