import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getFormInitialValues, SubmissionError } from 'redux-form';
import PartnerProfileCollaborationHistory from './partnerProfileCollaborationHistory';
import PartnerProfileCollaborationAccreditation from './partnerProfileCollaborationAccreditation';
import PartnerProfileCollaborationReferences from './partnerProfileCollaborationReferences';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';
import { changeTabToNext } from '../../../../reducers/partnerProfileEdit';
import { patchPartnerProfile } from '../../../../reducers/partnerProfileDetailsUpdate';
import { flatten } from '../../../../helpers/jsonMapper';
import { changedValues } from '../../../../helpers/apiHelper';
import { loadPartnerDetails } from '../../../../reducers/partnerProfileDetails';

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

    this.onNextClick = this.onNextClick.bind(this);
  }

  onNextClick(formValues) {
    const { initialValues, updateTab, partnerId,
      changeTab, loadPartnerProfileDetails } = this.props;

    const collaboration = flatten(formValues.collaboration);
    const initCollaboration = flatten(initialValues.collaboration);

    return updateTab(partnerId, 'collaboration', changedValues(initCollaboration, collaboration))
      .then(() => loadPartnerProfileDetails(partnerId).then(() => changeTab()))
      .catch((error) => {
        const errorMsg = error.response.data.non_field_errors || 'Error while saving sections. Please try again.';

        throw new SubmissionError({
          ...error.response.data,
          _error: errorMsg,
        });
      });
  }

  render() {
    const { readOnly } = this.props;

    return (<PartnerProfileStepperContainer
      name="collaboration"
      onSubmit={this.onNextClick}
      onNextClick={this.onNextClick}
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
  changeTab: PropTypes.func,
};

const mapState = (state, ownProps) => ({
  partnerId: ownProps.params.id,
  initialValues: getFormInitialValues('partnerProfile')(state),
});

const mapDispatch = dispatch => ({
  changeTab: () => dispatch(changeTabToNext()),
  loadPartnerProfileDetails: partnerId => dispatch(loadPartnerDetails(partnerId)),
  updateTab: (partnerId, tabName, body) => dispatch(patchPartnerProfile(partnerId, tabName, body)),
  dispatch,
});

const connectedPartnerProfileCollaboration = connect(mapState, mapDispatch)(PartnerProfileCollaboration);

export default withRouter(connectedPartnerProfileCollaboration);
