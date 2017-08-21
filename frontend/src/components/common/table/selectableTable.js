// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';

import SharedTable from './sharedTable';

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

  render() {}
}

SelectableTable.PropTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  columnData: PropTypes.array.isRequired,
};

export default SelectableTable;
