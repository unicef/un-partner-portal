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
import IconButton from 'material-ui/IconButton';

import EnhancedTableToolbar from '../common/table/enhancedTableToolbar';
import EnhancedTableHead from '../common/table/enhancedTableHead';
import SelectableTable from '../common/table/selectableTable';
import PinIcon from '../common/pinIcon';

const STATUSES = [
  'Open',
  'Closed',
  'Completed',
];


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
  pinnedIcon: {
    fill: theme.palette.success.primary,
  },
  cellWithTooltip: {
    overflow: 'visible',
  },
  headerIcon: {
    color: 'white',
  },
}));

class PartnerEoiTable extends SelectableTable {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      columnData: [
        { id: 'name', numeric: false, disablePadding: false, label: 'Project name' },
        { id: 'country', numeric: false, disablePadding: false, label: 'Country' },
        { id: 'sector', numeric: false, disablePadding: false, label: 'Sector' },
        { id: 'area', numeric: false, disablePadding: false, label: 'Area of specialization' },
        { id: 'agency', numeric: false, disablePadding: false, label: 'Agency' },
        { id: 'deadline', numeric: false, disablePadding: false, label: 'Application deadline' },
        { id: 'startDate', numeric: false, disablePadding: false, label: 'Project start date' },
        { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
      ],
    };
  }

  handleSelectAllClick(event, checked) {
    if (checked) {
      return this.setState({ selected: this.state.data.map(n => !n.pinned && n.id) });
    }
    return this.setState({ selected: [] });
  }

  render() {
    const { classes, title, renderItemIcon } = this.props;
    const { data, order, orderBy, selected, columnData, hoverOn } = this.state;
    return (
      <Paper elevation={0} className={classes.root}>
        <Paper >
          <EnhancedTableToolbar
            title={title}
            numSelected={selected.length}
          >
            <IconButton className={classes.headerIcon} aria-label="Pin all">
              <PinIcon />
            </IconButton>
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
                      <TableCell className={`${classes.limitedCell}`}>
                        {n.name}
                      </TableCell>
                      <TableCell >
                        {n.country}
                      </TableCell>
                      <TableCell >
                        {n.sector}
                      </TableCell>
                      <TableCell >
                        {n.area}
                      </TableCell>
                      <TableCell >
                        {n.agency}
                      </TableCell>
                      <TableCell >
                        {n.deadline}
                      </TableCell>
                      <TableCell >
                        {n.startDate}
                      </TableCell>
                      <TableCell className={classes.cellWithTooltip}>
                        {hoverOn === n.id
                          ? renderItemIcon(n, classes)
                          : STATUSES[n.status]}
                      </TableCell>
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

PartnerEoiTable.PropTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  columnData: PropTypes.array.isRequired,
  renderCells: PropTypes.func.isRequired,
};

export default withStyles(styleSheet)(PartnerEoiTable);
