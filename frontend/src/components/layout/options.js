import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { FormControlLabel } from 'material-ui/Form';
import { sessionChange } from '../../reducers/session';
import RadioGroupRow from '../common/radio/radioGroupRow';
import RadioHeight from '../common/radio/radioHeight';
import PaddedContent from '../common/paddedContent';


const messages = {
  label: 'Font size',
};

const styleSheet = theme => ({
  root: {
    width: '25vw',
    '&:hover': {
      backgroundColor: theme.palette.common.darkGreyBackground,
    },
  },
});

const radios = [
  { 
    value: '16px',
    label: '16px',
  },
  { 
    value: '14px',
    label: '14px',
  }
]


class Options extends Component {
  changeFontSize = (e, value) => {
    const {changeFontSize} = this.props;
    document.querySelector('html').style['font-size'] = value;
    changeFontSize(value);
  }

  render() {
    const { classes, fontSize } = this.props;
    return (
      <Paper className={classes.root}>
      <PaddedContent>
        <Typography type="body2">{messages.label}</Typography>
        <RadioGroupRow
          selectedValue={fontSize}
          onChange={this.changeFontSize}
        >
        {radios.map((value, index) => (
            <FormControlLabel
            key={index}
            value={`${value.value}`}
            control={<RadioHeight />}
            label={value.label}
          />
        ))}
        </RadioGroupRow>
        </PaddedContent>
      </Paper>
    );
  }
}

Options.propTypes = {
  classes: PropTypes.object,
  Options: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  fontSize: state.session.fontSize,
})


const mapDispatch = dispatch => ({
  changeFontSize: (fontSize) => dispatch( sessionChange({fontSize})),
});

const connectedOptions =
  connect(mapStateToProps, mapDispatch)(Options);

export default withStyles(styleSheet, { name: 'Options' })(connectedOptions);

