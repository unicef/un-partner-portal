import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import { PagingState, SelectionState } from '@devexpress/dx-react-grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import R from 'ramda';
import {
  Template, TemplateConnector, TemplateRenderer,
} from '@devexpress/dx-react-core';
import {
  TableRow as TableRowMUI,
} from 'material-ui/Table';
import { Grid, TableView, TableHeaderRow, TableSelection, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import SelectedHeader from './selectedHeader';
import ListLoader from './listLoader';
import { calculatePaginatedPage, updatePageNumberSize, updatePageNumber } from '../../../helpers/apiHelper';


const table = {
  allowedPageSizes: [5, 10, 15],
};

const styleSheet = (theme) => {
  const paddingSmall = theme.spacing.unit * 3;
  const paddingMedium = theme.spacing.unit * 4;

  return {
    container: {
      padding: `${paddingSmall}px 0 ${paddingSmall}px ${paddingMedium}px`,
      backgroundColor: theme.palette.primary[100],
    },
  };
};

const getSelectTableRowTemplateArgs = (
  { selectByRowClick, highlightSelected, hovered, ...restParams },
  { selection }, // current selection
// action that changes row selection
) => {
  const { rowId, row } = restParams.tableRow;
  return ({
    ...restParams,
    row,
    selectByRowClick,
    selected: highlightSelected && selection.indexOf(rowId) > -1,
    rowId,
    hovered: hovered === rowId,
  });
};

class SelectableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      hovered: null,
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleRowMouseEnter = this.handleRowMouseEnter.bind(this);
    this.handleRowMouseLeave = this.handleRowMouseLeave.bind(this);
    this.onPageSize = this.onPageSize.bind(this);
    this.tableRowTemplate = this.tableRowTemplate.bind(this);
  }

  componentWillMount() {
    const { pathName, query } = this.props;

    history.push({
      pathname: pathName,
      query: R.merge(query, { page: 1, page_size: 10 }),
    });
  }

  onPageSize(pageSize) {
    const { pageNumber, itemsCount, pathName, query } = this.props;

    updatePageNumberSize(calculatePaginatedPage(pageNumber, pageSize, itemsCount),
      pageSize, pathName, query);
  }

  handleSelect(newSelected) {
    return this.setState({ selected: newSelected });
  }

  handleRowMouseEnter(newHovered) {
    this.setState({ hoveredRow: newHovered });
  }

  handleRowMouseLeave() {
    this.setState({ hoveredRow: null });
  }
  navigationHeader(selected, rows, HeaderAction) {
    const { classes, itemsCount = 0, pageSize, pageNumber } = this.props;

    const firstRange = (pageSize * (pageNumber - 1)) + 1;
    const secondTmp = (pageSize * (pageNumber));

    const secondRange = secondTmp > itemsCount ? itemsCount : secondTmp;
    return (<div>
      {selected.length > 0
        ? <SelectedHeader numSelected={selected.length} >
          <HeaderAction rows={R.values(R.pick(selected, rows))} />
        </SelectedHeader>
        : <div className={classes.container}><Typography type="title">
          {`${isNaN(firstRange) ? 0 : firstRange}-${isNaN(secondRange) ? 0 : secondRange} of ${itemsCount} results`}
        </Typography></div>
      }
    </div>);
  }

  tableRowTemplate({ row, children, selected, rowId }) {
    return (<TableRowMUI
      selected={selected}
      hover
      style={{ cursor: this.props.clickableRow ? 'pointer' : 'auto' }}
      onClick={() => this.props.clickableRow && this.props.onTableRowClick(row)}
      onMouseEnter={() => this.handleRowMouseEnter(rowId)}
      onMouseLeave={() => this.handleRowMouseLeave()}
    > {children}
    </TableRowMUI>);
  }

  render() {
    const {
      items,
      columns,
      templateCell,
      headerAction,
      pageSize,
      pageNumber,
      itemsCount,
      loading,
      pathName,
      query,
    } = this.props;
    const { selected, hoveredRow } = this.state;
    return (
      <ListLoader loading={loading}>
        <Grid
          rows={items}
          columns={columns}
          headerPlaceholderTemplate={() => this.navigationHeader(
            selected,
            items,
            headerAction)}
        >
          <PagingState
            currentPage={pageNumber - 1}
            pageSize={+pageSize}
            onPageSizeChange={(size) => { this.onPageSize(size); }}
            onCurrentPageChange={(page) => { updatePageNumber(page, pathName, query); }}
            totalCount={itemsCount}
          />
          <SelectionState
            selection={selected}
            onSelectionChange={this.handleSelect}
          />
          <TableView
            tableRowTemplate={this.tableRowTemplate}
            table
            tableCellTemplate={({ row, column, tableRow: { rowId } }) =>
              templateCell({ row, column, hovered: hoveredRow === rowId })}
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
                        highlightSelected: true,
                        hovered: hoveredRow,
                        ...params,
                      }, getters, actions)
                    }
                  />
                )}
              </TemplateConnector>
            )}
          </Template>
          <TableSelection
            selectionColumnWidth={50}
          />
          <TableHeaderRow />
          <PagingPanel allowedPageSizes={table.allowedPageSizes} />
        </Grid>
      </ListLoader>
    );
  }
}

SelectableList.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  templateCell: PropTypes.func,
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  pageNumber: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  headerAction: PropTypes.func,
  loading: PropTypes.bool,
  pathName: PropTypes.string.isRequired,
  query: PropTypes.object,
  onTableRowClick: PropTypes.func,
  clickableRow: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  pathName: ownProps.location.pathname,
  query: ownProps.location.query,
  pageSize: ownProps.location.query.page_size || 0,
  pageNumber: ownProps.location.query.page || 0,
});

const connectedSelectableList = connect(mapStateToProps, null)(SelectableList);
const withRouterSelectableList = withRouter(connectedSelectableList);

export default withStyles(styleSheet, { name: 'SelectableList' })(withRouterSelectableList);

