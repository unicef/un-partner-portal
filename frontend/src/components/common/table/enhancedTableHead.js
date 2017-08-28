import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';


class EnhancedTableHead extends Component {
  createSortHandler(property) {
    return (event) => {
      this.props.onRequestSort(event, property);
    };
  }

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, columnData, selectable,
      firstCell } = this.props;
    return (
      <TableHead>
        <TableRow>
          { selectable &&
            <TableCell checkbox>
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < 5}
                checked={numSelected === 5}
                onChange={onSelectAllClick}
              />
            </TableCell>
          }
          {columnData.map((column, index) => (
            <TableCell
              className={(selectable || index !== 0) ? '' : firstCell}
              key={column.id}
              numeric={column.numeric}
              disablePadding={column.disablePadding}
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={order}
                onClick={this.createSortHandler(column.id)}
              >
                {column.label}
              </TableSortLabel>
            </TableCell>
          ), this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  /**
   * callback when sort request is done
   */
  onRequestSort: PropTypes.func.isRequired,
  /**
   * callback for all selection
   */
  onSelectAllClick: PropTypes.func,
  /**
   * string containing direction of sorting
   */
  order: PropTypes.oneOf(['asc', 'desc']),
  /**
   * column property that table is currently sorted by
   */
  orderBy: PropTypes.string.isRequired,
  /**
   * number of selected items in table
   */
  numSelected: PropTypes.number,
  /**
   * data for columns
   */
  columnData: PropTypes.array.isRequired,
  /**
   * whether header should display checkbox, also controls styling of first cell
   */
  selectable: PropTypes.bool,
  /**
   * styling for first cell (used when there is no select checkbox)
   */
  firstCell: PropTypes.string,
};

export default EnhancedTableHead;
