// eslint-disable-next-line
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SharedTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'Status',
      data: this.props.data,
      hoverOn: null,
      selectable: false,
      columnData: props.columnData,
    };
    this.handleRequestSort = this.handleRequestSort.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    return this.setState({ data: nextProps.data });
  }

  handleRequestSort(event, property) {
    const orderBy = property;
    let sortingFunc;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    if (orderBy === 'agency') {
      sortingFunc = (a, b) => (order === 'desc'
        ? b[orderBy].id > a[orderBy].id
        : a[orderBy].id > b[orderBy].id
      );
    } else {
      sortingFunc = (a, b) => (order === 'desc'
        ? b[orderBy] > a[orderBy]
        : a[orderBy] > b[orderBy]
      );
    }

    const data = this.state.data.sort(sortingFunc);

    return this.setState({ data, order, orderBy });
  }

  handleMouseEnter(id) {
    return () => this.setState({ hoverOn: id });
  }

  handleMouseLeave() {
    this.setState({ hoverOn: null });
  }
}

SharedTable.propTypes = {
  data: PropTypes.array.isRequired,
  columnData: PropTypes.array.isRequired,
};

export default SharedTable;
