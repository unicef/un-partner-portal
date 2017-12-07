import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Input from 'material-ui/Input';
import { FormHelperText } from 'material-ui/Form';
import ControlledModal from '../../../../common/modals/controlledModal';

const styleSheet = () => ({
  root: {
    maxHeight: '35vh',
  },
  year: {
    minWidth: '20vw',
    cursor: 'pointer',
    textAlign: 'center',
  },
  input: {
    textAlign: 'left',
    cursor: 'pointer',
  },
});

export const STATUS_VAL = [
  {
    value: true,
    label: 'Active',
  },
  {
    value: false,
    label: 'Completed',
  },
];

const messages = {
  selectYear: 'Select year',
};

class SelectYearModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 0,
      showModal: false,
      scrolled: false,
    };

    this.selectYear = this.selectYear.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.input) {
      this.setState({ selected: nextProps.input.value });
    }
  }

  componentDidUpdate() {
    if (this.refItem && !this.state.scrolled) {
      this.refItem.scrollIntoView();
    }
  }

  handleSelect() {
    const { input } = this.props;
    input.onChange(this.state.selected);
    this.setState({ showModal: false });
  }

  handleDialogOpen() {
    this.setState({
      selected: null,
      scrolled: false,
      showModal: true });
  }

  handleDialogClose() {
    this.setState({ showModal: false });
  }

  selectYear(event) {
    this.setState({ scrolled: true });
    this.setState({ selected: Number(event.target.textContent) });
  }

  years() {
    const { classes, input } = this.props;

    const currYear = this.state.selected ? this.state.selected : input.value;

    const currentYear = new Date().getFullYear() + 1;
    const years = [];

    for (let i = 0; i < currentYear - 1900; i += 1) {
      years.push(
        <div ref={(field) => {
          if (1900 + i === currYear) {
            this.refItem = field;
          }
        }}
        >
          <Button className={classes.year} onClick={this.selectYear}>
            {currYear === (1900 + i)
              ? <Typography type="headline" color="accent">{1900 + i}</Typography>
              : <Typography type="subheading">{1900 + i}</Typography>}
          </Button>
        </div>);
    }

    return (<div className={classes.root}>
      {years}
    </div>);
  }

  render() {
    const { input: { onBlur, onFocus, onChange, value, ...other }, placeholder, meta: { touched, error, warning } } = this.props;

    return (
      <div>
        <Input
          fullWidth
          readOnly
          placeholder={placeholder}
          value={value}
          inputProps={{
            ...other,
          }}
          onClick={this.handleDialogOpen}
          error={((touched && error) || warning)}
          {...other}
        />
        {((touched && error) || warning) && <FormHelperText error>{error || warning}</FormHelperText>}
        <ControlledModal
          maxWidth="md"
          title={messages.selectYear}
          trigger={this.state.showModal}
          handleDialogClose={this.handleDialogClose}
          removeContentPadding
          buttons={{
            flat: {
              handleClick: this.handleDialogClose,
            },
            raised: {
              handleClick: this.handleSelect,
            },
          }}
          content={this.years()}
        />
      </div >
    );
  }
}

SelectYearModal.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
  placeholder: PropTypes.string,
  input: PropTypes.object,
};

export default (withStyles(styleSheet, { name: 'SelectYearModal' })(SelectYearModal));
