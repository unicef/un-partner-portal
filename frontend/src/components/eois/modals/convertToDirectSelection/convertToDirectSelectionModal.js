import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { selectCfeiDetails } from '../../../../store';
import ControlledModal from '../../../common/modals/controlledModal';
import { convertCnToDS } from '../../../../reducers/cnConvertToDS';
import ConvertToDirectSelectionForm from './convertToDirectSelectionForm';

const messages = {
  title: 'Convert to Direct Selection',
  header: 'You are converting into direct selection an unsolicited concept note submitted by partner:',
  save: 'save',
};


class ConvertToDirectSelectionModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    this.props.handleDialogClose();
    const focal = R.assoc(
      'focal_points',
      values.focal_points.map(id => ({ id })),
      values);

    this.props.convertToDS(focal);
  }

  render() {
    const { id, submit, partnerName, dialogOpen, handleDialogClose } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          fullWidth
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          info={{
            title: messages.header,
            body: partnerName,
          }}
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
  partnerName: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);
  const {
    partner_name = null,
  } = cfei || {};

  return {
    partnerName: partner_name,
    showLoading: state.newCfei.openCfeiSubmitting,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  convertToDS: body => dispatch(convertCnToDS(body, ownProps.params.id)),
  submit: () => dispatch(submit('convertToDS')),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConvertToDirectSelectionModal);
