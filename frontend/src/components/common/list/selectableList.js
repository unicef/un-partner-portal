import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import { PagingState, SelectionState } from '@devexpress/dx-react-grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import R from 'ramda';
import { Grid, TableView, TableHeaderRow, TableSelection, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import SelectedHeader from './selectedHeader';
import TableTemplate from './tableTemplate';
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
    const { classes, itemsCount, pageSize, pageNumber } = this.props;

    const firstRange = (pageSize * (pageNumber - 1)) + 1;
    const secondTmp = (pageSize * (pageNumber));

    const secondRange = secondTmp > itemsCount ? itemsCount : secondTmp;
    return (<div>
      {selected.length > 0
        ? <SelectedHeader numSelected={selected.length} >
          <HeaderAction rows={R.values(R.pick(selected, rows))} />
        </SelectedHeader>
        : <div className={classes.container}><Typography type="title">
          {`${firstRange}-${secondRange} of ${itemsCount} results`}
        </Typography></div>
      }
    </div>);
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
            pageSize={pageSize}
            onPageSizeChange={(size) => { this.onPageSize(size); }}
            onCurrentPageChange={(page) => { updatePageNumber(page, pathName, query); }}
            totalCount={itemsCount}
          />
          <SelectionState
            selection={selected}
            onSelectionChange={this.handleSelect}
          />
          <TableView
            tableTemplate={TableTemplate(this.handleRowMouseEnter,
              this.handleRowMouseLeave,
              hoveredRow)}
            tableCellTemplate={templateCell}
          />
          <TableSelection
            selectionColumnWidth={50}
            highlightSelected
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
  templateHeader: PropTypes.func,
  itemsCount: PropTypes.object.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageNumber: PropTypes.number.isRequired,
  headerAction: PropTypes.component,
  loading: PropTypes.bool,
  pathName: PropTypes.string.isRequired,
  query: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  pathName: ownProps.location.pathname,
  query: ownProps.location.query,
  pageSize: ownProps.location.query.page_size,
  pageNumber: ownProps.location.query.page,
});

const connectedSelectableList = connect(mapStateToProps, null)(SelectableList);
const withRouterSelectableList = withRouter(connectedSelectableList);

export default withStyles(styleSheet, { name: 'SelectableList' })(withRouterSelectableList);

