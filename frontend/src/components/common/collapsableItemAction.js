import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import { withStyles } from 'material-ui/styles';

const styleSheet = (theme) => {
  const padding = theme.spacing.unit;
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
    paddingContent: {
      paddingLeft: '5px',
      paddingRight: '5px',
      background: '#F6F6F6',
    },
    alignItems: {
      display: 'flex',
      paddingTop: `${padding}px`,
      paddingBottom: `${padding}px`,
      alignItems: 'center',
      background: '#FFFFFF',
    },
    alignRight: {
      display: 'flex',
      paddingRight: `${padding}px`,
      alignItems: 'center',
      marginLeft: 'auto',
    },
    print: {
      display: 'none',
      '@media print': {
        display: 'block',
      },
    },
    noPrint: {
      '@media print': {
        visibility: 'hidden',
        display: 'none',
      },
    },
  };
};

class CollapsableItem extends Component {
  constructor(props) {
    super(props);

    this.state = { expanded: props.expanded };
    this.handleExpandClick = this.handleExpandClick.bind(this);
  }

  handleExpandClick() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { classes, title, component, actionComponent } = this.props;
    return (
      <div>
        <div className={classes.alignItems}>
          <IconButton
            className={classNames(classes.expand,
              classes.noPrint, {
                [classes.expandOpen]: this.state.expanded,
              })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          {title}
          <div className={`${classes.alignRight}`}>
            {actionComponent}
          </div>
        </div>
        <div className={`${classes.paddingContent} ${classes.print}`}>{component}</div>
        <Collapse
          className={classes.noPrint}
          in={this.state.expanded}
          timeout="auto"
          unmountOnExit
        >
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
  component: PropTypes.element,
  actionComponent: PropTypes.element,
  onExpand: PropTypes.func,
  loading: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'CollapsableItem' })(CollapsableItem);
