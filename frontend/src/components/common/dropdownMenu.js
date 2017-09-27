import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import { withStyles } from 'material-ui/styles';


const styleSheet = theme => ({
  item: {
    margin: 0,
    padding: 0,
    color: 'black',
    '&:hover': {
      color: theme.palette.secondary[500],
    },
  },
});

class DropdownMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      anchorEl: null,
      open: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  handleClick(event) {
    this.setState({ open: true, anchorEl: event.currentTarget });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  render() {
    const { classes, options } = this.props;
    const { open, anchorEl } = this.state;
    return (
      <div>
        <IconButton
          aria-label="More"
          aria-owns={open ? 'long-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onRequestClose={this.handleRequestClose}
        >
          {options.map(option => (
            <MenuItem
              className={classes.item}
              key={option.name}
              onClick={this.handleRequestClose}
            >
              {option.content}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

DropdownMenu.propTypes = {
  classes: PropTypes.object,
  options: PropTypes.objectOf({
    name: PropTypes.string,
    content: PropTypes.node,
  }),
};

export default withStyles(styleSheet, { name: 'DropdownMenu' })(DropdownMenu);
