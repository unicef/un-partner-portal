import R from 'ramda';
import React, { Component } from 'react';
import { withRouter, browserHistory as history } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getFormInitialValues, SubmissionError } from 'redux-form';
import PartnerProfileCollaborationHistory from './partnerProfileCollaborationHistory';
import PartnerProfileCollaborationAccreditation from './partnerProfileCollaborationAccreditation';
import PartnerProfileCollaborationReferences from './partnerProfileCollaborationReferences';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';
import { patchPartnerProfile } from '../../../../reducers/partnerProfileDetailsUpdate';
import { flatten } from '../../../../helpers/jsonMapper';
import { changedValues } from '../../../../helpers/apiHelper';
import { loadPartnerDetails } from '../../../../reducers/partnerProfileDetails';
import { emptyMsg } from '../partnerProfileEdit';

const STEPS = readOnly => [
  {
    component: <PartnerProfileCollaborationHistory readOnly={readOnly} />,
    label: 'History of Partnership',
    name: 'history',
  },
  {
    component: <PartnerProfileCollaborationAccreditation readOnly={readOnly} />,
    label: 'Accreditation (optional)',
    name: 'accreditation',
  },
  {
    component: <PartnerProfileCollaborationReferences readOnly={readOnly} />,
    label: 'References (optional)',
    name: 'reference',
  },
];


class PartnerProfileCollaboration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actionOnSubmit: {},
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleExit = this.handleExit.bind(this);
  }

  onSubmit() {
    const { partnerId, tabs, params: { type } } = this.props;

    if (this.state.actionOnSubmit === 'next') {
      const index = tabs.findIndex(itab => itab.path === type);
      history.push({
        pathname: `/profile/${partnerId}/edit/${tabs[index + 1].path}`,
      });
    } else if (this.state.actionOnSubmit === 'exit') {
      history.push(`/profile/${partnerId}/overview`);
    }
  }

  handleNext() {
    this.setState({ actionOnSubmit: 'next' });
  }

  handleExit() {
    this.setState({ actionOnSubmit: 'exit' });
  }

  handleSubmit(formValues) {
    const { initialValues, updateTab, partnerId, loadPartnerProfileDetails } = this.props;

    const unflattenColl = R.dissoc('collaboration_evidences', formValues.collaboration);
    const unflattenCollInit = R.dissoc('collaboration_evidences', initialValues.collaboration);

    const accreditation = R.map(item => R.dissoc('evidence_file', R.assoc('evidence_file_id', item.evidence_file,
      R.assoc('mode', 'Acc', item))), unflattenColl.accreditation.accreditations);
    const reference = R.map(item => R.dissoc('evidence_file', R.assoc('evidence_file_id', item.evidence_file,
      R.assoc('mode', 'Ref', item))), unflattenColl.reference.references);

    const mergedEvidences = R.map((item) => {
      let newItem = item;
      if (!R.is(Number, item.evidence_file_id)) {
        newItem = R.dissoc('evidence_file_id', item);
      }
      if (item.date_received === 'Invalid date') {
        newItem = R.dissoc('date_received', item);
      }
      return newItem;
    }, R.concat(accreditation, reference));

    const historyPartnership = R.map(item => R.dissoc('agency', R.assoc('agency_id', item.agency, item)), unflattenColl.history.collaborations_partnership);
    const changedHistory = R.assocPath(['history', 'collaborations_partnership'], historyPartnership, unflattenColl);

    const collaboration = flatten(R.assoc('collaboration_evidences', mergedEvidences, changedHistory));
    const initCollaboration = flatten(R.assoc('collaboration_evidences', [], unflattenCollInit));
    const changed = changedValues(initCollaboration, collaboration);

    const filterPartnerships = R.assoc('collaborations_partnership', R.filter(item => !R.isNil(item.agency_id), changed.collaborations_partnership), changed);
    let patchValues = R.assoc('collaboration_evidences', R.filter(item => !R.isNil(item.organization_name), filterPartnerships.collaboration_evidences), filterPartnerships);

    if (R.isEmpty(patchValues.collaboration_evidences)) {
      patchValues = R.dissoc('collaboration_evidences', patchValues);
    }

    if (R.isEmpty(patchValues.collaborations_partnership)) {
      patchValues = R.dissoc('collaborations_partnership', patchValues);
    }

    if (!R.isEmpty(patchValues)) {
      return updateTab(partnerId, 'collaboration', patchValues)
        .then(() => loadPartnerProfileDetails(partnerId).then(() => this.onSubmit()))
        .catch((error) => {
          const errorMsg = error.response.data.non_field_errors || 'Error while saving sections. Please try again.';

          throw new SubmissionError({
            ...error.response.data,
            _error: errorMsg,
          });
        });
    }

    throw new SubmissionError({
      _error: emptyMsg,
    });
  }

  render() {
    const { readOnly } = this.props;

    return (<PartnerProfileStepperContainer
      name="collaboration"
      handleNext={this.handleNext}
      handleExit={this.handleExit}
      onSubmit={this.handleSubmit}
      readOnly={readOnly}
      steps={STEPS(readOnly)}
    />
    );
  }
}

PartnerProfileCollaboration.propTypes = {
  readOnly: PropTypes.bool,
  partnerId: PropTypes.string,
  updateTab: PropTypes.func,
  initialValues: PropTypes.object,
  loadPartnerProfileDetails: PropTypes.func,
  tabs: PropTypes.array,
  params: PropTypes.object,
};

const mapState = (state, ownProps) => ({
  partnerId: ownProps.params.id,
  tabs: state.partnerProfileDetailsNav.tabs,
  initialValues: getFormInitialValues('partnerProfile')(state),
});

const mapDispatch = dispatch => ({
  loadPartnerProfileDetails: partnerId => dispatch(loadPartnerDetails(partnerId)),
  updateTab: (partnerId, tabName, body) => dispatch(patchPartnerProfile(partnerId, tabName, body)),
  dispatch,
});

const connectedPartnerProfileCollaboration = connect(mapState, mapDispatch)(PartnerProfileCollaboration);

export default withRouter(connectedPartnerProfileCollaboration);
