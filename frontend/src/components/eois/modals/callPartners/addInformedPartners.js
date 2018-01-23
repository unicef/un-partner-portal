import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import Loader from '../../../common/loader';
import ControlledModal from '../../../common/modals/controlledModal';
import { updateCfei } from '../../../../reducers/newCfei';
import CallPartnersForm from './callPartnersForm';
import { selectCfeiDetails } from '../../../../store';
import { amendPartnersCache } from '../../../../reducers/cache';

const messages = {
  title: 'Invite Partners',
  header: {
    title: 'You can inform Partners registered to work in the country(ies) selected about this ' +
    'offer.',
    body: 'If you would like to invite specific partners registered in the portal to apply for the CFEI, enter their names below, and they will receive an e-mail notification.',
  },
  skip: 'skip',
  send: 'send',
};


class CallPartnersModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  componentDidMount() {
    const { cachePartners, currentPartners } = this.props;
    cachePartners(currentPartners);
  }

  onFormSubmit({ invited_partners: partnerIds }) {
    const { partners } = this.props;
    const selectedPartners = partnerIds
      .map(selectedId => partners.find(({ id }) => id === selectedId))
      .filter(Boolean);

    return this.props.updateCfei({
      invited_partners: selectedPartners,
    }).then(() => {
      this.props.handleDialogClose();
    });
  }

  render() {
    const { id, submitInvite, dialogOpen, handleDialogClose } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={dialogOpen.invite}
          handleDialogClose={handleDialogClose}
          info={messages.header}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: submitInvite,
              label: messages.save,
            },
          }}
          content={<CallPartnersForm overlap={false} id={id} onSubmit={this.onFormSubmit} />}
        />
      </div >
    );
  }
}

CallPartnersModal.propTypes = {
  id: PropTypes.string,
  submitInvite: PropTypes.func,
  dialogOpen: PropTypes.object,
  handleDialogClose: PropTypes.func,
  updateCfei: PropTypes.func,
  partners: PropTypes.array,
  currentPartners: PropTypes.array,
  cachePartners: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);

  return {
    showLoading: state.newCfei.openCfeiSubmitting,
    partners: state.cache.partners,
    currentPartners: cfei ? cfei.invited_partners : [],
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateCfei: body => dispatch(updateCfei(body, ownProps.id)),
  submitInvite: () => dispatch(submit('callPartners')),
  cachePartners: partners => dispatch(amendPartnersCache(partners)),
});

const containerCallPartnersModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CallPartnersModal);

export default containerCallPartnersModal;
