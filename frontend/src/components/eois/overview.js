
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import Grid from 'material-ui/Grid';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import FilterListIcon from 'material-ui-icons/FilterList';

let counter = 0;
function createData(name, country, sector, area, agency, deadline, startDate, status) {
  counter += 1;
  return { id: counter, name, country, sector, area, agency, deadline, startDate, status };
}

const columnData = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Project name' },
  { id: 'country', numeric: false, disablePadding: false, label: 'Country' },
  { id: 'sector', numeric: false, disablePadding: false, label: 'Sector' },
  { id: 'area', numeric: false, disablePadding: false, label: 'Area of specialization' },
  { id: 'agency', numeric: false, disablePadding: false, label: 'Agency' },
  { id: 'deadline', numeric: false, disablePadding: false, label: 'Application deadline' },
  { id: 'startDate', numeric: false, disablePadding: false, label: 'Project start date' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
];

const STATUSES = [
  'Open',
  'Closed',
  'Completed',
];

class EnhancedTableHead extends Component {
  createSortHandler(property) {
    return (event) => {
      this.props.onRequestSort(event, property);
    };
  }

  render() {
    const { onSelectAllClick, order, orderBy, numSelected } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell checkbox>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < 5}
              checked={numSelected === 5}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columnData.map(column => (
            <TableCell
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

const toolbarStyleSheet = createStyleSheet(theme => ({
  root: {
    paddingRight: 2,
    backgroundColor: theme.palette.primary[100],
    width: '100%',
  },
  highlight: {
    color: 'white',
    backgroundColor: theme.palette.accent[500],
  },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
}));

let EnhancedTableToolbar = (props) => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0
          ? <Typography type="subheading" color="inherit">
            {numSelected} selected
          </Typography>
          : <Typography type="title" color="inherit">List of Calls for Expressions of Interest</Typography>}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 &&
          <IconButton aria-label="Delete">
            <DeleteIcon />
          </IconButton>
        }
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.PropTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyleSheet)(EnhancedTableToolbar);

const styleSheet = createStyleSheet(theme => ({
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
}));

class EnhancedTable extends Component {
  constructor() {
    super();
    this.state = {
      order: 'asc',
      orderBy: 'Status',
      selected: [],
      data: [
        createData('Capacity building for small rural farmers in Kenia', 'Kenia', 'Food Security', 'Agriculture Inputs', 'UNICEF', '01 Jan 2016', '30 Sep 2017', 0),
        createData('Capacity building for small rural farmers in Chile', 'Chile', 'Food Security', 'Agriculture Inputs', 'UNICEF', '04 Mar 2017', '30 Sep 2017', 0),
        createData('Capacity building for small rural farmers in Ukraine', 'Ukraine', 'Food Security', 'Agriculture Inputs', 'UNICEF', '30 Jun 1994', '30 Sep 2017', 2),
        createData('Capacity building for small rural farmers in Vietnam', 'Vietnam', 'Food Security', 'Agriculture Inputs', 'UNICEF', '30 Jun 2018', '30 Sep 2017', 1),
        createData('Capacity building for small rural farmers in Kanada', 'Kanada', 'Food Security', 'Agriculture Inputs', 'UNICEF', '29 Jun 2017', '30 Sep 2017', 2),
      ],
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleRequestSort = this.handleRequestSort.bind(this);
    this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.showTooltip = this.showTooltip.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleRequestSort(event, property) {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data = this.state.data.sort(
      (a, b) => (order === 'desc' ? b[orderBy] > a[orderBy] : a[orderBy] > b[orderBy]),
    );

    return this.setState({ data, order, orderBy });
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

  hideTooltip() {
    this.setState({ tooltipShown: null });
  }

  showTooltip(id) {
    this.setState({ tooltipShown: id });
  }

  handleMouseEnter(event, id) {
    this.showTooltip(id);
  }

  handleMouseLeave() {
    this.hideTooltip();
  }

  render() {
    const classes = this.props.classes;
    const { data, order, orderBy, selected } = this.state;

    return (
      <Paper elevation={0} className={classes.root}>
        <Paper >
          <EnhancedTableToolbar numSelected={selected.length}/>
          <Paper elevation={0} className={classes.paper}>
            <Table>
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
              />
              <TableBody>
                {data.map((n) => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      // onKeyDown={event => this.handleKeyDown(event, n.id)}
                      onMouseLeave={this.handleMouseLeave}
                      onMouseEnter={event => this.handleMouseEnter(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex="-1"
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell checkbox>
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell className={classes.limitedCell}>
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
                      <TableCell >
                        {(this.state.tooltipShown === n.id) ? 'Icon' : STATUSES[n.status]}
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

EnhancedTable.PropTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(EnhancedTable);
