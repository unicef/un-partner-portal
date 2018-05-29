import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import { submit, SubmissionError } from 'redux-form';
import Grid from 'material-ui/Grid';
import ControlledModal from '../../../common/modals/controlledModal';
import OpenForm from './openForm';
import DirectForm from './directForm';
import UnsolicitedForm from './unsolicitedForm';
import { addDirectCfei, addOpenCfei, addUnsolicitedCN } from '../../../../reducers/newCfei';
import CallPartnersModal from '../callPartners/callPartnersModal';
import { PROJECT_TYPES } from '../../../../helpers/constants';
import { errorToBeAdded } from '../../../../reducers/errorReducer';
import { selectCountriesWithOptionalLocations } from '../../../../store';

const messages = {
  title: {
    open: 'Create new Call for Expressions of Interests',
    direct: 'Create new direct selection/retention',
    unsolicited: 'Create new Unsolicited Concept Note',
  },
  header: {
    open: {
      title: 'This CFEI is for open selections.',
    },
    direct: {
      title: 'This is a direct selection.',
      body: 'In order to save this form, you will need to identify the partner(s).',
    },
  },
  error: {
    open: 'Unable to create new Call for Expressions of Interests',
    direct: 'Unable to create new direct selection/retention',
    unsolicited: 'Unable to create new Unsolicited Concept Note',
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

const getErrorMessage = (type) => {
  switch (type) {
    case PROJECT_TYPES.OPEN:
    default:
      return messages.error.open;
    case PROJECT_TYPES.DIRECT:
      return messages.error.direct;
    case PROJECT_TYPES.UNSOLICITED:
      return messages.error.unsolicited;
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
    return this.props.postCfei(values).then(
      (cfei) => {
        this.setState({ id: cfei && cfei.id });
        this.props.onDialogClose();

        if (this.props.type !== PROJECT_TYPES.OPEN) {
          history.push(`/cfei/${this.props.type}/${cfei.id}/overview`);
        }
      }).catch((error) => {
      this.props.postError(error, getErrorMessage(this.props.type));
      throw new SubmissionError({
        ...error.response.data,
        _error: getErrorMessage(this.props.type),
      });
    });
  }

  handleDialogSubmit() {
    this.props.submit();
  }

  handleConfirmation() {
    this.setState({ disabled: !this.state.disabled });
  }

  render() {
    const { open, type, onDialogClose, optionalLocations } = this.props;
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
            optionalLocations,
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
  postError: PropTypes.func,
  optionalLocations: PropTypes.array,
};

const mapStateToProps = state => ({
  optionalLocations: selectCountriesWithOptionalLocations(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  postCfei: values => dispatch(getPostMethod(ownProps.type)(values)),
  submit: () => dispatch(submit(getFormName(ownProps.type))),
  postError: (error, message) => dispatch(errorToBeAdded(error, `newProject${ownProps.type}`, message)),
});

const connected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewCfeiModal);

export default withRouter(connected);

