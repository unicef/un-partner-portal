import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import Grid from 'material-ui/Grid';
import ControlledModal from '../../../common/modals/controlledModal';
import OpenForm from './openForm';
import DirectForm from './directForm';
import UnsolicitedForm from './unsolicitedForm';
import { addDirectCfei, addOpenCfei } from '../../../../reducers/newCfei';
import CallPartnersModal from '../callPartners/callPartnersModal';
import { PROJECT_TYPES } from '../../../../helpers/constants';


const messages = {
  title: 'Create new Call for Expressions of Interests',
  unsolicitedTitle: 'Submit new Unsolicited Concept Note',
  header: {
    open: {
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

const getTitle = (type) => {
  switch (type) {
    case PROJECT_TYPES.UNSOLICITED:
      return messages.unsolicitedTitle;
    default:
      return messages.title;
  }
};

const getFormName = (type) => {
  switch (type) {
    case PROJECT_TYPES.OPEN:
    default:
      return 'newOpenCfei';
    case PROJECT_TYPES.DIRECT:
      return 'newDirectCfei';
  }
};

const getInfo = (type) => {
  switch (type) {
    case PROJECT_TYPES.OPEN:
    default:
      return messages.header.open;
    case PROJECT_TYPES.DIRECT:
      return messages.header.direct;
  }
};

const getPostMethod = (type) => {
  switch (type) {
    case PROJECT_TYPES.OPEN:
    default:
      return addOpenCfei;
    case PROJECT_TYPES.DIRECT:
      return addDirectCfei;
  }
};

const getModal = (type) => {
  switch (type) {
    case PROJECT_TYPES.OPEN:
    default:
      return OpenForm;
    case PROJECT_TYPES.DIRECT:
      return DirectForm;
    case PROJECT_TYPES.UNSOLICITED:
      return UnsolicitedForm;
  }
};

class NewCfeiModal extends Component {
  constructor(props) {
    super(props);
    this.state = { id: null };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDialogSubmit = this.handleDialogSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.onDialogClose();
    this.props.postCfei(values).then(
      (cfei) => {
        this.setState({ id: cfei && cfei.id });
      });
  }

  handleDialogSubmit() {
    this.props.submit();
  }

  render() {
    const { open, type, onDialogClose } = this.props;
    return (
      <Grid item>
        <ControlledModal
          maxWidth="md"
          title={getTitle(type)}
          trigger={open}
          info={type === PROJECT_TYPES.UNSOLICITED ? null : getInfo(type)}
          buttons={{
            flat: {
              handleClick: onDialogClose,
            },
            raised: {
              handleClick: this.handleDialogSubmit,
            },
          }}
          content={React.createElement(getModal(type), { onSubmit: this.handleSubmit })}
        />
        {type === PROJECT_TYPES.OPEN && <CallPartnersModal id={this.state.id} />}
      </Grid>
    );
  }
}

NewCfeiModal.propTypes = {
  open: PropTypes.bool,
  type: PropTypes.string,
  onDialogClose: PropTypes.func,
  postCfei: PropTypes.func,
  submit: PropTypes.func,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  postCfei: values => dispatch(getPostMethod(ownProps.type)(values)),
  submit: () => dispatch(submit(getFormName(ownProps.type))),
});

export default connect(
  null,
  mapDispatchToProps,
)(NewCfeiModal);

