import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import { PagingState, SelectionState } from '@devexpress/dx-react-grid';
import Checkbox from 'material-ui/Checkbox';
import { Paper } from 'material-ui';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import R from 'ramda';
import {
  Template, TemplateConnector, TemplateRenderer,
} from '@devexpress/dx-react-core';
import {
  TableRow as TableRowMUI,
  TableCell,
} from 'material-ui/Table';
import { Grid, Table, TableHeaderRow, TableSelection, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { calculatePaginatedPage, updatePageNumberSize, updatePageNumber } from '../../helpers/apiHelper';
import { saveSelections } from '../../reducers/selectableListItems';
import SelectedHeader from '../common/list/selectedHeader';
import ListLoader from '../common/list/listLoader';

const table = {
  allowedPageSizes: [5, 10, 15],
};

const styleSheet = (theme) => {
  const paddingSmall = theme.spacing.unit * 2;
  const paddingMedium = theme.spacing.unit * 4;

  return {
    container: {
      display: 'flex',
      alignItems: 'center',
      padding: `${paddingSmall}px 0 ${paddingSmall}px ${paddingMedium}px`,
      backgroundColor: theme.palette.primary[100],
    },
    select: {
      marginLeft: 'auto',
      marginRight: `${paddingSmall}px`,
    }
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
      hovered: null,
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleRowMouseEnter = this.handleRowMouseEnter.bind(this);
    this.handleRowMouseLeave = this.handleRowMouseLeave.bind(this);
    this.onPageSize = this.onPageSize.bind(this);
    this.tableRowTemplate = this.tableRowTemplate.bind(this);
    this.clearSelections = this.clearSelections.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.selectionCell = this.selectionCell.bind(this);
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

  handleSelect(newSelected, isSelected) {
    const { saveSelectedItems, selections } = this.props;
    let appendSelection = [];

    if (isSelected) {
      appendSelection = selections.concat(newSelected);
    } else {
      appendSelection = R.filter(item => item !== newSelected, selections);
    }

    saveSelectedItems(appendSelection);
  }

  handleRowMouseEnter(newHovered) {
    this.setState({ hoveredRow: newHovered });
  }

  handleRowMouseLeave() {
    this.setState({ hoveredRow: null });
  }

  navigationHeader(selected, rows, HeaderAction, componentHeaderAction) {
    const { classes, itemsCount = 0, pageSize, pageNumber } = this.props;

    const firstRange = (pageSize * (pageNumber - 1)) + 1;
    const secondTmp = (pageSize * (pageNumber));

    const secondRange = secondTmp > itemsCount ? itemsCount : secondTmp;
    return (<div>
      {selected.length > 0
        ? <SelectedHeader numSelected={selected.length} >
          {componentHeaderAction || (HeaderAction && <HeaderAction rows={R.values(R.pick(selected, rows))} />)}
        </SelectedHeader>
        : <div className={classes.container}>
          <Typography type="title">
            {`${isNaN(firstRange) ? 0 : firstRange}-${isNaN(secondRange) ? 0 : secondRange} of ${itemsCount} results`}
          </Typography>
          <div className={classes.select}>{componentHeaderAction}</div>
        </div>
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
    >{children}</TableRowMUI>);
  }

  clearSelections() {
    const { saveSelectedItems } = this.props;

    saveSelectedItems([]);
  }

  selectAll() {
    const { items, saveSelectedItems } = this.props;

    saveSelectedItems(items.map(item => item.id));
  }

  selectionCell(rowIndex) {
    const { selections } = this.props;

    return (<TableCell padding="checkbox">
      <Checkbox
        checked={R.contains(rowIndex, selections)}
        onChange={(event, selected) => this.handleSelect(rowIndex, selected)}
      />
    </TableCell>);
  }

  render() {
    const {
      items,
      columns,
      templateCell,
      headerAction,
      componentHeaderAction,
      pageSize,
      pageNumber,
      itemsCount,
      loading,
      pathName,
      hideList,
      query,
      selections,
    } = this.props;
    const { hoveredRow } = this.state;
    return (
      !hideList && <ListLoader
        loading={loading}
      >
        <Paper>
          <Grid
            rows={items}
            columns={columns}
            headerPlaceholderComponent={() => this.navigationHeader(
              selections,
              items,
              headerAction,
              componentHeaderAction)}
          >
            <PagingState
              currentPage={pageNumber - 1}
              pageSize={pageSize}
              onPageSizeChange={(size) => { this.onPageSize(size); }}
              onCurrentPageChange={(page) => { updatePageNumber(page, pathName, query); }}
              totalCount={itemsCount}
            />
            <SelectionState />
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
              cellComponent={({ row: { id } }) => this.selectionCell(id)}
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
  hideList: PropTypes.bool,
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
  componentHeaderAction: PropTypes.object,
  loading: PropTypes.bool,
  pathName: PropTypes.string.isRequired,
  query: PropTypes.object,
  onTableRowClick: PropTypes.func,
  clickableRow: PropTypes.bool,
  saveSelectedItems: PropTypes.func,
  selections: PropTypes.array,
};

const mapStateToProps = (state, ownProps) => ({
  pathName: ownProps.location.pathname,
  query: ownProps.location.query,
  pageSize: Number(ownProps.location.query.page_size) || 0,
  pageNumber: Number(ownProps.location.query.page) || 0,
  selections: state.selectableList.items,
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

