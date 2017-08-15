import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
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

const styleSheet = createStyleSheet('RegularTable', theme => ({
  root: {
    background: theme.palette.primary[200],
    padding: theme.spacing.unit * 3,
  },
  paper: {
    width: '100%',
    overflowX: 'scroll',
  },
  limitedCell: {
    maxWidth: 250,
  },
  firstCell: {
    padding: `0px 4px 0px ${theme.spacing.unit * 4}px`,
  },
}));

class SelectableTable extends SharedTable {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      ...{
        selected: [],
        selectable: true,
      },
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
    const { classes, columnData, title, renderCells } = this.props;
    const { data, order, orderBy, selected, selectable } = this.state;
    return (
      <Paper elevation={0} className={classes.root}>
        <Paper >
          <EnhancedTableToolbar
            title={title}
            numSelected={selected.length}
          />
          <Paper elevation={0} className={classes.paper}>
            <Table>
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                columnData={columnData}
                selectable={selectable}
              />
              <TableBody>
                {data.map((n) => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      onKeyDown={event => this.handleKeyDown(event, n.id)}
                      onMouseLeave={this.handleMouseLeave}
                      onMouseEnter={this.handleMouseEnter(n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex="-1"
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell checkbox>
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      {renderCells(n, this.state, classes)}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </Paper>
      </Paper>
    );
  }
}

SelectableTable.PropTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  columnData: PropTypes.array.isRequired,
  renderCells: PropTypes.func.isRequired,
};

export default withStyles(styleSheet)(SelectableTable);
