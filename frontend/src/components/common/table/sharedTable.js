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
    };
    this.handleRequestSort = this.handleRequestSort.bind(this);
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

  handleMouseEnter(id) {
    return () => this.setState({ hoverOn: id });
  }

  handleMouseLeave() {
    this.setState({ hoverOn: null });
  }
}

SharedTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default SharedTable;
