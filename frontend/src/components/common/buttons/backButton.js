import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory as history } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'ramda';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import ArrowBack from 'material-ui-icons/ArrowBack';
import { withStyles } from 'material-ui/styles';

const styleSheet = theme => ({
  backButtonHeight: {
    height: theme.spacing.unit * 3,
  },
  btnColor: {
    color: '#ffffff', 
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
    const { classes, arrowBack } = this.props;
    return (
      <IconButton
        className={`${classes.backButtonHeight} ${classes.noPrint}`}
        onClick={this.handleClick}
      >
        {arrowBack ? <ArrowBack className={classes.btnColor} /> : <KeyboardArrowLeft />}
      </IconButton>
    );
  }
}

BackButton.propTypes = {
  classes: PropTypes.object,
  previousPath: PropTypes.string,
  arrowBack: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  previousPath: state.routesHistory.previousPath || ownProps.defaultPath,
});


export default compose(
  withStyles(styleSheet, { name: 'backButton' }),
  connect(mapStateToProps),
)(BackButton);

