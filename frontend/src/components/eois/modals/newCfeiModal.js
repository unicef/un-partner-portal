import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import Grid from 'material-ui/Grid';
import ControlledModal from '../../common/modals/controlledModal';
import OpenForm from './openForm';
import DirectForm from './directForm';
import { addDirectCfei, addOpenCfei } from '../../../reducers/newCfei';
import CallPartnersModal from './callPartnersModal';

const messages = {
  title: 'Create new Call for Expressions of Interests',
  header: {
    calls: {
      title: 'This CFEI is for open selections.',
      body: 'If you would like to notify specific partners about this CFEI, you can select ' +
      'their names on the next page of this form.',
    },
    direct: {
      title: 'This is a direct selection.',
      body: 'You will need to select a Partner to save this form.',
    },
  },

};

const modals = {
  calls: OpenForm,
  direct: DirectForm,
};

const formNames = {
  calls: 'newOpenCfei',
  direct: 'newDirectCfei',
};

const postMethods = {
  calls: addOpenCfei,
  direct: addDirectCfei,
};

class NewCfeiModal extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDialogSubmit = this.handleDialogSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.onDialogClose();
    this.props.postCfei(values);
  }

  handleDialogSubmit() {
    this.props.submit();
  }

  render() {
    const { open, path, onDialogClose } = this.props;
    return (
      <Grid item>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={open}
          info={messages.header[path]}
          buttons={{
            flat: {
              handleClick: onDialogClose,
            },
            raised: {
              handleClick: this.handleDialogSubmit,
            },
          }}
          content={React.createElement(modals[path], { onSubmit: this.handleSubmit })}
        />
        <CallPartnersModal />
      </Grid>
    );
  }
}

NewCfeiModal.propTypes = {
  open: PropTypes.bool,
  path: PropTypes.string,
  onDialogClose: PropTypes.func,
  postCfei: PropTypes.func,
  submit: PropTypes.func,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  postCfei: values => postMethods[ownProps.path](dispatch, values),
  submit: () => dispatch(submit(formNames[ownProps.path])),
});

export default connect(
  null,
  mapDispatchToProps,
)(NewCfeiModal);

