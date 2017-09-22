import React from 'react';
import PropTypes from 'prop-types';

import {
  Table as TableMUI,
  TableBody as TableBodyMUI,
  TableHead as TableHeadMUI,
  TableRow as TableRowMUI,
} from 'material-ui';

import {
  TableLayout,
} from '@devexpress/dx-react-grid';

const MINIMAL_COLUMN_WIDTH = 120;

/* eslint-disable react/prop-types */
const tableTemplate = ({ children, ...restProps }) => (
  <TableMUI {...restProps}>{children}</TableMUI>
);
const headTemplate = ({ children, ...restProps }) => (
  <TableHeadMUI {...restProps}>{children}</TableHeadMUI>
);
const bodyTemplate = ({ children, ...restProps }) => (
  <TableBodyMUI {...restProps}>{children}</TableBodyMUI>
);

const rowTemplate = (handleRowMouseEnter, handleRowMouseLeave) =>
  ({ children, row, ...restProps }) => (
    <TableRowMUI
      selected={row.selected}
      hover
      {...restProps}
      onMouseEnter={() => handleRowMouseEnter(row.rowId)}
      onMouseLeave={() => handleRowMouseLeave()}
    >
      {children}
    </TableRowMUI>
  );

const Table = (handleRowMouseEnter, handleRowMouseLeave, hoveredRow) => ({
  headerRows, bodyRows, getRowId,
  columns,
  cellTemplate,
  onClick,
  allowColumnReordering, setColumnOrder,
}) => {
  const newRows = bodyRows.map((row, index) => {
    const newRow = Object.assign({}, row.row, { hovered: index === hoveredRow });
    return Object.assign({}, row, { row: newRow });
  });
  return (
    <TableLayout
      headerRows={headerRows}
      rows={newRows}
      getRowId={getRowId}
      columns={columns}
      minColumnWidth={MINIMAL_COLUMN_WIDTH}
      tableTemplate={tableTemplate}
      headTemplate={headTemplate}
      bodyTemplate={bodyTemplate}
      rowTemplate={rowTemplate(handleRowMouseEnter, handleRowMouseLeave)}
      cellTemplate={cellTemplate}
      onClick={onClick}
      allowColumnReordering={allowColumnReordering}
      setColumnOrder={setColumnOrder}
    />
  );
};
Table.defaultProps = {
  onClick: () => { },
};
Table.propTypes = {
  headerRows: PropTypes.array.isRequired,
  bodyRows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  cellTemplate: PropTypes.func.isRequired,
  getRowId: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  allowColumnReordering: PropTypes.bool.isRequired,
  setColumnOrder: PropTypes.func.isRequired,
};

export default Table;
