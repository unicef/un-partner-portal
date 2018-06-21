import React, { Component } from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { submit } from 'redux-form';
import Grid from 'material-ui/Grid';
import ControlledModal from '../../../common/modals/controlledModal';
import EditDsrForm from './editDsrForm';
import { updateCfei } from '../../../../reducers/newCfei';
import { errorToBeAdded } from '../../../../reducers/errorReducer';
import { selectCountriesWithOptionalLocations } from '../../../../store';

const messages = {
  title: 'Edit direct selection/retention',
  save: 'Save',
  error: 'Unable to update direct selection/retention',
};

class EditDsrModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      disabled: false };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDialogSubmit = this.handleDialogSubmit.bind(this);
    this.handleConfirmation = this.handleConfirmation.bind(this);
  }

  handleSubmit(values) {
    const i = values.countries;
    const normalizedValues = values;
    normalizedValues.locations = [];
    R.map(loc => normalizedValues.locations.push(loc.locations[0]), i);
    return this.props.patchDsr(normalizedValues).then(() => {
      this.props.handleDialogClose();
    });
  }

  handleDialogSubmit() {
    this.props.submit();
  }

  handleConfirmation() {
    this.setState({ disabled: !this.state.disabled });
  }

  render() {
    const { open, handleDialogClose, params: { id } } = this.props;
    return (
      <Grid item>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={open}
          info={null}
          handleDialogClose={handleDialogClose}
          topBottomPadding
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              label: messages.save,
              handleClick: this.handleDialogSubmit,
              disabled: this.state.disabled,
            },
          }}
          content={<EditDsrForm id={id} onSubmit={this.handleSubmit} />}
        />
      </Grid>
    );
  }
}

EditDsrModal.propTypes = {
  open: PropTypes.bool,
  onDialogClose: PropTypes.func,
  patchDsr: PropTypes.func,
  submit: PropTypes.func,
  postError: PropTypes.func,
  handleDialogClose: PropTypes.func,
  params: PropTypes.object,
};

const mapStateToProps = state => ({
  optionalLocations: selectCountriesWithOptionalLocations(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  patchDsr: body => dispatch(updateCfei(body, ownProps.id)),
  submit: () => dispatch(submit('editDsr')),
  postError: (error, message) => dispatch(errorToBeAdded(error, `newProject${ownProps.type}`, message)),
});

const connected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditDsrModal);

export default withRouter(connected);

