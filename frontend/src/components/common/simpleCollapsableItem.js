import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

import { withStyles } from 'material-ui/styles';

const styleSheet = (theme) => {
  const paddingMedium = theme.spacing.unit * 10;

  return {
    expand: {
      transform: 'rotate(0deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    alignItems: {
      display: 'flex',
      alignItems: 'center',
    },
    padding: {
      paddingRight: `${paddingMedium}px`,
    },
    icon: {
      fill: '#FF0000',
      width: 36,
      height: 36,
    },
    editIcon: {
      fill: '#FFFFFF',
      '&:hover': {
        fill: '#8B8C8D',
      },
    },
  };
};

class CollapsableItem extends Component {
  constructor(props) {
    super(props);

    this.handleExpandClick = this.handleExpandClick.bind(this);
  }

  componentWillMount() {
    this.state = { expanded: this.props.expanded };
  }

  handleExpandClick() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { classes, title, component } = this.props;
    return (
      <div>
        <div className={classes.alignItems}>
          <IconButton
            className={classNames(classes.icon, classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          {title}
        </div>
        <Collapse in={this.state.expanded} transitionDuration="auto" unmountOnExit>
          <div className={classes.paddingContent}>{component}</div>
        </Collapse>
      </div>
    );
  }
}

CollapsableItem.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  component: PropTypes.component,
};

export default withStyles(styleSheet, { name: 'CollapsableItem' })(CollapsableItem);
