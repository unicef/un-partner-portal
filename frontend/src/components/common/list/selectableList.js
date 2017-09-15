import React, { Component } from 'react';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import { PagingState, LocalPaging, RowDetailState, SelectionState } from '@devexpress/dx-react-grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { Grid, TableView, TableHeaderRow, TableRowDetail, TableSelection, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import SelectedHeader from './selectedHeader';
import TableTemplate from './tableTemplate';


const table = {
  allowedPageSizes: [5, 10, 15, 0],
};

const styleSheet = createStyleSheet('HeaderList', (theme) => {
  const paddingSmall = theme.spacing.unit * 3;
  const paddingMedium = theme.spacing.unit * 4;

  return {
    container: {
      padding: `${paddingSmall}px 0 ${paddingSmall}px ${paddingMedium}px`,
      backgroundColor: theme.palette.primary[100],
    },
  };
});

class PaginatedList extends Component {
  static navigationHeader(classes, numSelected) {
    return (<div>
      {numSelected > 0
        ? <SelectedHeader numSelected={numSelected} >
          <Button color='inherit'> Check </Button>
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
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.changeExpandedDetails = expandedRows => this.setState({ expandedRows });
  }

  handleSelect(newSelected) {
    return this.setState({ selected: newSelected });
  }

  render() {
    const { classes, items, columns, templateCell,
      onCurrentPageChange, onPageSizeChange } = this.props;
    const { selected } = this.state;
    console.log(selected)
    return (
      <Grid
        rows={items}
        columns={columns}
        headerPlaceholderTemplate={() => PaginatedList.navigationHeader(classes, selected.length)}
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
          tableTemplate={TableTemplate}
          tableCellTemplate={({ row, column, style }) =>
            templateCell(row, column, style)}
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

PaginatedList.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  templateCell: PropTypes.func.isRequired,
  expandable: PropTypes.bool,
  expandedCell: PropTypes.func,
  onCurrentPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
};

export default withStyles(styleSheet)(PaginatedList);
