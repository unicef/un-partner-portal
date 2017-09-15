import React, { Component } from 'react';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import { PagingState, LocalPaging, RowDetailState, SelectionState } from '@devexpress/dx-react-grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { Grid, TableView, TableHeaderRow, TableRowDetail, TableSelection, PagingPanel } from '@devexpress/dx-react-grid-material-ui';

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
  static navigationHeader(classes) {
    return (<div className={classes.container}><Typography type="title">
          1-10 of 12 results to show
    </Typography></div>);
  }

  constructor(props) {
    super(props);

    this.changeExpandedDetails = expandedRows => this.setState({ expandedRows });
  }

  render() {
    const { classes, items, columns, templateCell,
      onCurrentPageChange, onPageSizeChange } = this.props;
    return (
      <Grid
        rows={items}
        columns={columns}
        headerPlaceholderTemplate={() => PaginatedList.navigationHeader(classes)}
      >
        <PagingState
          defaultCurrentPage={0}
          defaultPageSize={10}
          onPageSizeChange={(pageSize) => { onPageSizeChange(pageSize); }}
          onCurrentPageChange={(page) => { onCurrentPageChange(page); }}
        />
        <LocalPaging />

        <SelectionState />
        <TableView
          tableCellTemplate={({ row, column, style }) =>
            templateCell(row, column, style)}
        />
        <TableSelection />
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
