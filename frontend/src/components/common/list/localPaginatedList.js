import React, { Component } from 'react';
import { Grid, Table, TableHeaderRow, TableRowDetail, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { withStyles } from 'material-ui/styles';
import { PagingState, SortingState, RowDetailState, LocalPaging, LocalSorting } from '@devexpress/dx-react-grid';
import PropTypes from 'prop-types';
import { Paper } from 'material-ui';
import Typography from 'material-ui/Typography';
import {
  Template, TemplateConnector, TemplateRenderer,
} from '@devexpress/dx-react-core';
import {
  TableRow as TableRowMUI,
  TableCell,
} from 'material-ui/Table';
import ListLoader from './listLoader';


const table = {
  allowedPageSizes: [5, 10, 15],
};

const styleSheet = (theme) => {
  const paddingSmall = theme.spacing.unit * 2;
  const paddingBig = theme.spacing.unit * 3;
  return {
    container: {
      padding: `${paddingSmall}px 0 ${paddingSmall}px ${paddingBig}px`,
    },
  };
};

const getSelectTableRowTemplateArgs = (
  { selectByRowClick, highlightSelected, hovered, ...restParams }, // current selection
// action that changes row selection
) => {
  const { rowId, row } = restParams.tableRow;
  return ({
    ...restParams,
    row,
    selectByRowClick,
    rowId,
    hovered: hovered === rowId,
  });
};

class PaginatedList extends Component {
  constructor(props) {
    super(props);
    this.changeExpandedDetails = expandedRowIds => this.setState({ expandedRowIds });
    this.tableRowTemplate = this.tableRowTemplate.bind(this);

    this.state = {
      currentPage: 0,
      pageSize: 5,
      pageSizes: [5, 10, 15],
    };
  }

  navigationHeader() {
    const { classes, title } = this.props;
    return (<div className={classes.container}><Typography type="title">
      {title}
    </Typography></div>);
  }

  tableRowTemplate({ row, children, tableRow: { rowId } }) {
    return (
      <TableRowMUI
        hover
        style={{ cursor: this.props.clickableRow ? 'pointer' : 'auto' }}
        onClick={() => { if (this.props.clickableRow) this.props.onTableRowClick(row); }}
      >
        {children}
      </TableRowMUI>
    );
  }

  render() {
    const { items,
      columns,
      templateCell,
      expandable,
      expandedCell,
      loading } = this.props;


    return (
      <ListLoader loading={loading}>
        <Grid
          rows={items}
          columns={columns}
        >

          <PagingState />
          <LocalPaging />

          <SortingState />
          <LocalSorting />
          <Table
            table
            rowComponent={this.tableRowTemplate}
            cellComponent={({ row, column, value, tableRow: { rowId } }) =>
              templateCell({ row, column, value })}
          />

          <Template
            name="tableViewRow"
            // use custom template only for table data rows
            predicate={({ tableRow }) => tableRow.type === 'data'}
          >
            {params => (
              <TemplateConnector>
                {(getters, actions) => (
                  <TemplateRenderer
                    // custom template
                    template={this.tableRowTemplate}
                    // custom template params
                    params={
                      getSelectTableRowTemplateArgs({
                        selectByRowClick: true,
                        highlightRow: true,
                        hovered: hoveredRow,
                        ...params,
                      }, getters, actions)
                    }
                  />
                )}
              </TemplateConnector>
            )}
          </Template>
          <TableHeaderRow allowSorting />

          {expandable &&
            <TableRowDetail contentComponent={({ row }) => expandedCell(row)} />}

          <PagingPanel
            allowedPageSizes={table.allowedPageSizes}
          />
        </Grid>
      </ListLoader>
    );
  }
}

PaginatedList.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  items: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  templateCell: PropTypes.func,
  expandable: PropTypes.bool,
  expandedCell: PropTypes.func,
  loading: PropTypes.bool,
  onTableRowClick: PropTypes.func,
  clickableRow: PropTypes.bool,
};

PaginatedList.defaultProps = {
  templateCell: ({ value }) => <TableCell>{value}</TableCell>,
};

export default withStyles(styleSheet, { name: 'PaginatedList' })(PaginatedList);
