import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory as history } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'ramda';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import { withStyles } from 'material-ui/styles';

const styleSheet = theme => ({
  backButtonHeight: {
    height: theme.spacing.unit * 3,
  },
  noPrint: {
    '@media print': {
      visibility: 'hidden',
      display: 'none',
    },
  },
});


class BackButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backRefer: props.previousPath,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    history.push(this.state.backRefer);
  }

  render() {
    const { classes } = this.props;
    return (
      <IconButton
        className={`${classes.backButtonHeight} ${classes.noPrint}`}
        onClick={this.handleClick}
      >
        <KeyboardArrowLeft />
      </IconButton>
    );
  }
}

BackButton.propTypes = {
  classes: PropTypes.object,
  previousPath: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  previousPath: state.routesHistory.previousPath || ownProps.defaultPath,
});


export default compose(
  withStyles(styleSheet, { name: 'backButton' }),
  connect(mapStateToProps),
)(BackButton);

