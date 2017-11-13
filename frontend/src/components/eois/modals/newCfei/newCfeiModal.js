import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { submit } from 'redux-form';
import Grid from 'material-ui/Grid';
import ControlledModal from '../../../common/modals/controlledModal';
import OpenForm from './openForm';
import DirectForm from './directForm';
import UnsolicitedForm from './unsolicitedForm';
import { addDirectCfei, addOpenCfei, addUnsolicitedCN } from '../../../../reducers/newCfei';
import CallPartnersModal from '../callPartners/callPartnersModal';
import { PROJECT_TYPES } from '../../../../helpers/constants';


const messages = {
  title: {
    open: 'Create new Call for Expressions of Interests',
    direct: 'Create new direct selection',
    unsolicited: 'Create new Unsolicited Concept Note',
  },
  header: {
    open: {
      title: 'This CFEI is for open selections.',
      body: 'If you would like to notify specific partners about this CFEI, you can select ' +
      'their names on the next page of this form.',
    },
    direct: {
      title: 'This is a direct selection.',
      body: 'In order to save this form, you will need to identify the partner(s).',
    },
  },

};

const getTitle = (type) => {
  switch (type) {
    case PROJECT_TYPES.UNSOLICITED:
      return messages.title.unsolicited;
    case PROJECT_TYPES.OPEN:
      return messages.title.open;
    case PROJECT_TYPES.DIRECT:
      return messages.title.direct;
    default:
      return messages.title.direct;
  }
};

const getFormName = (type) => {
  switch (type) {
    case PROJECT_TYPES.OPEN:
    default:
      return 'newOpenCfei';
    case PROJECT_TYPES.DIRECT:
      return 'newDirectCfei';
    case PROJECT_TYPES.UNSOLICITED:
      return 'newUnsolicitedCN';
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
    case PROJECT_TYPES.UNSOLICITED:
      return addUnsolicitedCN;
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
    this.state = { id: null, disabled: props.type === PROJECT_TYPES.UNSOLICITED };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDialogSubmit = this.handleDialogSubmit.bind(this);
    this.handleConfirmation = this.handleConfirmation.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open && !nextProps.open) {
      this.setState({ disabled: this.props.type === PROJECT_TYPES.UNSOLICITED });
    }
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

  handleConfirmation() {
    this.setState({ disabled: !this.state.disabled });
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
          handleDialogClose={onDialogClose}
          buttons={{
            flat: {
              handleClick: onDialogClose,
            },
            raised: {
              handleClick: this.handleDialogSubmit,
              disabled: this.state.disabled,
            },
          }}
          content={React.createElement(getModal(type), {
            onSubmit: this.handleSubmit,
            handleConfirmation: this.handleConfirmation })}
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

const connected = connect(
  null,
  mapDispatchToProps,
)(NewCfeiModal);

export default withRouter(connected);

