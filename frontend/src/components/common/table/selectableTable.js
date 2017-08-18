// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableRow,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';

import EnhancedTableToolbar from './enhancedTableToolbar';
import EnhancedTableHead from './enhancedTableHead';
import SharedTable from './sharedTable';
import TableStyleSheet from './tableStyling';

class SelectableTable extends SharedTable {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      selected: [],
      selectable: true,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
    this.isSelected = this.isSelected.bind(this);
  }

  handleSelectAllClick(event, checked) {
    if (checked) {
      return this.setState({ selected: this.state.data.map(n => n.id) });
    }
    return this.setState({ selected: [] });
  }

  handleClick(event, id) {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    return this.setState({ selected: newSelected });
  }


  isSelected(id) {
    return this.state.selected.indexOf(id) !== -1;
  }

  render() {
    const { classes, title, renderTableCells, toolbarIcons } = this.props;
    const { data, order, orderBy, selected, columnData, hoverOn } = this.state;
    return (
      <Paper >
        <EnhancedTableToolbar
          title={title}
          numSelected={selected.length}
        >
          {toolbarIcons}
        </EnhancedTableToolbar>
        <Paper elevation={0} className={classes.paper}>
          <Table>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              columnData={columnData}
              selectable
            />
            <TableBody>
              {data.map((n) => {
                const isSelected = this.isSelected(n.id);
                return (
                  <TableRow
                    hover
                    onMouseLeave={this.handleMouseLeave}
                    onMouseEnter={this.handleMouseEnter(n.id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex="-1"
                    key={n.id}
                    selected={isSelected}
                  >
                    <TableCell checkbox>
                      <Checkbox
                        checked={isSelected}
                        onClick={event => this.handleClick(event, n.id)}
                      />
                    </TableCell>
                    {renderTableCells(n, classes, hoverOn)}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Paper>
    );
  }
}

SelectableTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  columnData: PropTypes.array.isRequired,
  renderCells: PropTypes.func.isRequired,
};

export default withStyles(TableStyleSheet)(SelectableTable);