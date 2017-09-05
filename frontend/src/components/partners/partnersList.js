import React, { Component } from 'react';
import { TableCell } from 'material-ui/Table';
import { PagingState, LocalPaging, RowDetailState } from '@devexpress/dx-react-grid';
import PropTypes from 'prop-types';
import { Grid, TableView, TableHeaderRow, TableRowDetail, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import PartnerProfileDetailItem from './partnerProfileDetailItem';
import PartnerProfileNameCell from './partnerProfileNameCell';

const table = {
  allowedPageSizes: [5, 10, 15, 0],
};

class PartnersList extends Component {
  constructor(props) {
    super(props);

    this.changeExpandedDetails = expandedRows => this.setState({ expandedRows });
    this.rowTemplate = ({ row }) => <PartnerProfileDetailItem partner={row.details} />;
  }

  render() {
    const { items, columns, onRowClick } = this.props;
    return (
      <Grid
        rows={items}
        columns={columns}
      >
        <PagingState
          defaultCurrentPage={0}
          defaultPageSize={5}
        />
        <LocalPaging />
        <RowDetailState
          onExpandedRowsChange={this.changeExpandedDetails}
        />
        <TableView
          tableCellTemplate={({ row, column, style }) => {
            if (column.name === 'name') {
              return (<PartnerProfileNameCell
                verified={row.verified}
                yellowFlag={row.flagYellow}
                redFlag={row.flagRed}
                name={row.name}
              />);
            }
            return <TableCell onClick={() => onRowClick(row)}>{row[column.name]}</TableCell>;
          }}
        />
        <TableHeaderRow />

        <TableRowDetail
          template={this.rowTemplate}
        />
        <PagingPanel
          allowedPageSizes={table.allowedPageSizes}
        />
      </Grid>
    );
  }
}

PartnersList.propTypes = {
  items: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onRowClick: PropTypes.func,
};

export default PartnersList;
