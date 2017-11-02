import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import ControlledModal from '../../../common/modals/controlledModal';
import { convertCnToDS } from '../../../../reducers/cnConvertToDS';
import ConvertToDirectSelectionForm from './convertToDirectSelectionForm';

const messages = {
  title: 'Convert to Direct Selection',
  header: { title: 'This is direct selection for proposal submitted by Partner:' },
  save: 'save',
};


class ConvertToDirectSelectionModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    this.props.handleDialogClose();
    const focal = R.assoc('focal_points', [{ id: values.focal_points }], values);

    this.props.convertToDS(focal);
  }

  render() {
    const { id, submit, dialogOpen, handleDialogClose } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          fullWidth
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          info={messages.header}
          minWidth={40}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: submit,
              label: messages.save,
            },
          }}
          content={<ConvertToDirectSelectionForm id={id} onSubmit={this.onFormSubmit} />}
        />
      </div >
    );
  }
}

ConvertToDirectSelectionModal.propTypes = {
  dialogOpen: PropTypes.bool,
  id: PropTypes.string,
  submit: PropTypes.func,
  convertToDS: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapStateToProps = state => ({
  showLoading: state.newCfei.openCfeiSubmitting,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  convertToDS: body => dispatch(convertCnToDS(body, ownProps.id)),
  submit: () => dispatch(submit('convertToDS')),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConvertToDirectSelectionModal);
