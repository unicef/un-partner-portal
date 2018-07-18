import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import { PagingState, SelectionState } from '@devexpress/dx-react-grid';
import { Paper } from 'material-ui';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import R from 'ramda';
import {
  Template, TemplateConnector, TemplateRenderer,
} from '@devexpress/dx-react-core';
import {
  TableRow as TableRowMUI,
} from 'material-ui/Table';
import { Grid, Table, TableHeaderRow, TableSelection, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import SelectedHeader from './selectedHeader';
import ListLoader from './listLoader';
import { calculatePaginatedPage, updatePageNumberSize, updatePageNumber } from '../../../helpers/apiHelper';
import { saveSelections } from '../../../reducers/selectableListItems';


const table = {
  allowedPageSizes: [5, 10, 15],
};

const styleSheet = (theme) => {
  const paddingSmall = theme.spacing.unit * 2;
  const paddingMedium = theme.spacing.unit * 4;

  return {
    container: {
      padding: `${paddingSmall}px 0 ${paddingSmall}px ${paddingMedium}px`,
      backgroundColor: theme.palette.primary[100],
    },
  };
};

const getSelectTableRowTemplateArgs = (
  { selectByRowClick, highlightRow, hovered, ...restParams },
  { selection }, // current selection
// action that changes row selection
) => {
  const { rowId, row } = restParams.tableRow;
  return ({
    ...restParams,
    row,
    selectByRowClick,
    selected: highlightRow && selection.indexOf(rowId) > -1,
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
    this.clearSelections = this.clearSelections.bind(this);
  }

  componentWillMount() {
    const { pathName, query } = this.props;

    history.push({
      pathname: pathName,
      query: R.merge(query, { page: 1, page_size: 10 }),
    });
  }

  componentWillReceiveProps(nextProps) {
    const { pathName, query = {} } = nextProps;
    if (!query.page || !query.page_size) {
      history.push({
        pathname: pathName,
        query: R.merge(query, { page: this.state.page, page_size: this.state.page_size }),
      });
    }
  }

  onPageSize(pageSize) {
    const { pageNumber, itemsCount, pathName, query } = this.props;

    updatePageNumberSize(calculatePaginatedPage(pageNumber, pageSize, itemsCount),
      pageSize, pathName, query);
  }

  handleSelect(newSelected) {
    const { saveSelectedItems } = this.props;
    saveSelectedItems(newSelected);

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
          {HeaderAction && <HeaderAction rows={R.values(R.pick(selected, rows))} />}
        </SelectedHeader>
        : <div className={classes.container}><Typography type="title">
          {`${isNaN(firstRange) ? 0 : firstRange}-${isNaN(secondRange) ? 0 : secondRange} of ${itemsCount} results`}
        </Typography></div>
      }
    </div>);
  }

  tableRowTemplate({ row, children, selected, tableRow: { rowId } }) {
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

  clearSelections() {
    const { saveSelectedItems } = this.props;

    this.setState({
      selected: [],
    });

    saveSelectedItems([]);
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
      <ListLoader
        loading={loading}
      >
        <Paper>
          <Grid
            rows={items}
            columns={columns}
            headerPlaceholderComponent={() => this.navigationHeader(
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
            <TableSelection
              selectionColumnWidth={50}
            />
            <TableHeaderRow />
            <PagingPanel allowedPageSizes={table.allowedPageSizes} />
          </Grid>
        </Paper>
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
  saveSelectedItems: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  pathName: ownProps.location.pathname,
  query: ownProps.location.query,
  pageSize: ownProps.location.query.page_size || 0,
  pageNumber: ownProps.location.query.page || 0,
});

const mapDispatch = dispatch => ({
  saveSelectedItems: items => dispatch(saveSelections(items)),
});

const connectedSelectableList = connect(
  mapStateToProps,
  mapDispatch,
  null,
  { withRef: true })(SelectableList);

const withRouterSelectableList = withRouter(connectedSelectableList, { withRef: true });

export default withStyles(styleSheet, { name: 'SelectableList' })(withRouterSelectableList);

