import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { PagingState, LocalPaging, SelectionState } from '@devexpress/dx-react-grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import R from 'ramda';
import { Grid, TableView, TableHeaderRow, TableSelection, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import SelectedHeader from './selectedHeader';
import TableTemplate from './tableTemplate';
import NoDataCell from './noDataCell';


const table = {
  allowedPageSizes: [5, 10, 15, 0],
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
  static navigationHeader(classes, selected, rows, HeaderAction) {
    return (<div>
      {selected.length > 0
        ? <SelectedHeader numSelected={selected.length} >
          <HeaderAction rows={R.values(R.pick(selected, rows))} />
        </SelectedHeader>
        : <div className={classes.container}>
          <Typography type="title">
            1-10 of 12 results to show
          </Typography>
        </div>
      }
    </div>);
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      hovered: null,
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleRowMouseEnter = this.handleRowMouseEnter.bind(this);
    this.handleRowMouseLeave = this.handleRowMouseLeave.bind(this);
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

  render() {
    const { classes,
      items,
      columns,
      templateCell,
      onCurrentPageChange,
      onPageSizeChange,
      headerAction,
      loading,
    } = this.props;
    const { selected, hoveredRow } = this.state;
    return (
      <Grid
        rows={items}
        columns={columns}
        headerPlaceholderTemplate={() => SelectableList.navigationHeader(
          classes,
          selected,
          items,
          headerAction)}
      >
        <PagingState
          defaultCurrentPage={0}
          defaultPageSize={10}
          onPageSizeChange={(pageSize) => { onPageSizeChange(pageSize); }}
          onCurrentPageChange={(page) => { onCurrentPageChange(page); }}
        />
        <LocalPaging />
        <SelectionState
          selection={selected}
          onSelectionChange={this.handleSelect}
        />
        <TableView
          tableTemplate={TableTemplate(this.handleRowMouseEnter,
            this.handleRowMouseLeave,
            hoveredRow)}
          tableNoDataCellTemplate={({ colSpan }) => (
            <NoDataCell loading={loading} colSpan={colSpan} />
          )}
          tableCellTemplate={templateCell}
        />
        <TableSelection
          selectionColumnWidth={50}
          highlightSelected
        />
        <TableHeaderRow />
        <PagingPanel allowedPageSizes={table.allowedPageSizes} />
      </Grid>
    );
  }
}

SelectableList.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  templateCell: PropTypes.func,
  templateHeader: PropTypes.func,
  onCurrentPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  headerAction: PropTypes.component,
  loading: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'SelectableList' })(SelectableList);
