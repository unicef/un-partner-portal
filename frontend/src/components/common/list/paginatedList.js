import R from 'ramda';
import React, { Component } from 'react';
import { Grid, Table, TableHeaderRow, TableRowDetail, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { withStyles } from 'material-ui/styles';
import { PagingState, SortingState, RowDetailState } from '@devexpress/dx-react-grid';
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
import SpreadContent from '../spreadContent';


const table = {
  allowedPageSizes: [5, 10, 15],
};

const styleSheet = (theme) => {
  const paddingSmall = theme.spacing.unit * 2;
  const paddingBig = theme.spacing.unit * 3;
  return {
    container: {
      padding: `${paddingSmall}px ${paddingBig}px ${paddingSmall}px ${paddingBig}px`,
      backgroundColor: theme.palette.primary[100],
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
      hovered: null,
    };

    this.handleRowMouseEnter = this.handleRowMouseEnter.bind(this);
    this.handleRowMouseLeave = this.handleRowMouseLeave.bind(this);
  }

  navigationHeader(headerAction) {
    const { classes, itemsCount = 0, pageSize, pageNumber } = this.props;
    const firstRange = (pageSize * (pageNumber - 1)) + 1;
    const secondTmp = (pageSize * (pageNumber));
    const secondRange = secondTmp > itemsCount ? itemsCount : secondTmp;
    return (
      <div className={classes.container}>
        <SpreadContent>
          <Typography type="title">
            {`${isNaN(firstRange) ? 0 : firstRange}-${isNaN(secondRange) ? 0 : secondRange} of ${itemsCount} results`}
          </Typography>
          {headerAction || null}
        </SpreadContent>
      </div>);
  }

  changeSorting(sorting) {
    this.setState({
      sorting,
    });
  }

  handleRowMouseEnter(newHovered) {
    this.setState({ hoveredRow: newHovered });
  }

  handleRowMouseLeave() {
    this.setState({ hoveredRow: null });
  }

  tableRowTemplate({ row, children, tableRow: { rowId } }) {
    return (
      <TableRowMUI
        hover
        style={{ cursor: this.props.clickableRow ? 'pointer' : 'auto' }}
        onClick={() => { if (this.props.clickableRow) this.props.onTableRowClick(row); }}
        onMouseEnter={() => this.handleRowMouseEnter(rowId)}
        onMouseLeave={() => this.handleRowMouseLeave()}
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
      itemsCount,
      pageSize,
      pageNumber,
      loading,
      sorting,
      headerAction,
      allowSorting,
      changeSorting,
      changePageSize,
      changePageNumber,
      customColumns } = this.props;

    const { hoveredRow } = this.state;

    return (
      <ListLoader loading={loading}>
        <Paper>
          <Grid
            rows={items}
            columns={columns}
            headerPlaceholderComponent={() => this.navigationHeader(headerAction)}
          >
            {allowSorting && <SortingState
              sorting={sorting}
              onSortingChange={changeSorting}
            />}

            <PagingState
              currentPage={pageNumber - 1}
              pageSize={pageSize}
              onPageSizeChange={changePageSize}
              onCurrentPageChange={changePageNumber}
              totalCount={itemsCount || 0}
            />

            {expandable &&
              <RowDetailState onExpandedRowIdsChange={this.changeExpandedDetails} />}

            <Table
              table
              rowComponent={this.tableRowTemplate}
              cellComponent={({ row, column, value, tableRow: { rowId } }) =>
                templateCell({ row, column, value, hovered: hoveredRow === rowId })}
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
            <TableHeaderRow cellComponent={({ ...props }) => {
              if (customColumns && R.contains(props.column.name, customColumns)) {
                return <TableCell>{props.column.title}</TableCell>
              } 

              return <TableHeaderRow.Cell {...props} />
            }} allowSorting={allowSorting} />

            {expandable &&
              <TableRowDetail contentComponent={({ row }) => expandedCell(row)} />}

            <PagingPanel
              allowedPageSizes={table.allowedPageSizes}
            />
          </Grid>
        </Paper>
      </ListLoader>
    );
  }
}

PaginatedList.propTypes = {
  classes: PropTypes.object.isRequired,
  itemsCount: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  templateCell: PropTypes.func,
  expandable: PropTypes.bool,
  expandedCell: PropTypes.func,
  loading: PropTypes.bool,
  pageSize: PropTypes.number.isRequired,
  pageNumber: PropTypes.number.isRequired,
  sorting: PropTypes.array,
  changeSorting: PropTypes.func,
  allowSorting: PropTypes.bool,
  changePageSize: PropTypes.func,
  changePageNumber: PropTypes.func,
  onTableRowClick: PropTypes.func,
  clickableRow: PropTypes.bool,
  customColumns: PropTypes.array,
  headerAction: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

PaginatedList.defaultProps = {
  templateCell: ({ value }) => <TableCell>{value}</TableCell>,
};

export default withStyles(styleSheet, { name: 'PaginatedList' })(PaginatedList);
