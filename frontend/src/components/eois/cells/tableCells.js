import React from 'react';
import { TableCell } from 'material-ui/Table';
import EoiSectorCell from './eoiSectorCell';
import EoiPartnersStatusCell from './eoiPartnersStatusCell';
import EoiStatusCell from './eoiStatusCell';
import EoiCountryCell from './eoiCountryCell';
import EoiPartnersCell from './eoiPartnersCell';
import EoiNameCell from './eoiNameCell';

export default type => ({ row, column }) => {
  if (column.name === 'title') {
    return <EoiNameCell title={row.title} id={row.id} />;
  } else if (column.name === 'country_code') {
    return (
      <TableCell >
        {row.country_code.map(code =>
          (<span>
            <EoiCountryCell code={code} />
            {', '}
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
          partners={row.selected_partners}
        />
      </TableCell>);
  } else if (column.name === 'selected_partners') {
    return (
      <TableCell >
        <EoiPartnersCell partners={row.selected_partners || []} />
      </TableCell>);
  }
  return undefined;
};
