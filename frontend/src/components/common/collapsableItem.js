import IconButton from 'material-ui/IconButton';
import Warning from 'material-ui-icons/Warning';
import Collapse from 'material-ui/transitions/Collapse';
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ModeEdit from 'material-ui-icons/ModeEdit';
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
    },
    alignItems: {
      display: 'flex',
      paddingTop: `${padding}px`,
      paddingBottom: `${padding}px`,
      alignItems: 'center',
      background: '#F6F6F6',
    },
    padding: {
      paddingRight: `${paddingMedium}px`,
    },
    alignRight: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    icon: {
      fill: '#FF0000',
      width: 20,
      height: 20,
    },
    editIcon: {
      fill: '#F6F6F6',
      '&:hover': {
        fill: '#8B8C8D',
      },
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

    this.handleExpandClick = this.handleExpandClick.bind(this);
  }

  componentWillMount() {
    this.state = { expanded: this.props.expanded };
  }

  handleExpandClick() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { classes, title, component, warning, handleEditMode } = this.props;
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
          <div className={`${classes.alignRight} ${classes.noPrint}`}>
            {!warning ?
              <div className={classes.padding}>
                <Warning className={classes.icon} />
              </div>
              : null
            }
            <IconButton className={classes.noPrint} onClick={handleEditMode}>
              <ModeEdit className={classes.editIcon} />
            </IconButton>
          </div>
        </div>
        <div className={`${classes.paddingContent} ${classes.print}`}>{component}</div>
        <Collapse
          className={classes.noPrint}
          in={this.state.expanded}
          transitionDuration="auto"
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
  warning: PropTypes.bool,
  component: PropTypes.component,
  handleEditMode: PropTypes.func.isRequired,
};

export default withStyles(styleSheet, { name: 'CollapsableItem' })(CollapsableItem);
