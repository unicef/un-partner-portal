import React from 'react';
import { pluck, assoc } from 'ramda';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import GridColumn from '../../../common/grid/gridColumn';
import Timeline from './timeline';
import ProjectDetails from './projectDetails';
import SelectionCriteria from './selectionCriteria';
import PartnerClarificationRequests from './partnerClarificationRequests';
import AgencyClarificationAnswers from './agencyClarificationAnswers';
import InformedPartners from './informedPartners';
import SelectedPartners from './selectedPartners';
import SelectedPartnersDirect from './selectedPartners/selectedPartnersContainer';
import SelectedPartnerJustification from './selectedPartners/selectedPartnerJustification';
import { selectCfeiDetails } from '../../../../store';
import { ROLES, PROJECT_TYPES } from '../../../../helpers/constants';
import ConceptNote from './conceptNote';

const messages = {
  cnTemplate: 'Concept Note Template',
  cn: 'Concept Note',
};

const CfeiOverview = (props) => {
  const { params: { id, type }, role, cn, isComplete, cn_template,
    partner, partnerId, displayGoal, loading, agency, agencyId } = props;

  return (
    <form >
      <GridColumn >
        {type === PROJECT_TYPES.OPEN && !loading && <Timeline id={id} />}
        <Grid container direction="row" spacing={24}>
          <Grid item xs={12} sm={8}>
            <ProjectDetails
              formName={'cfeiDetails'}
              type={type}
              role={role}
              partnerId={partnerId}
              partner={partner}
              displayGoal={displayGoal}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <GridColumn>
              {(role === ROLES.PARTNER && type === PROJECT_TYPES.OPEN)
                && <ConceptNote title={messages.cnTemplate} conceptNote={cn_template} />}
              {(type === PROJECT_TYPES.UNSOLICITED)
                && <ConceptNote title={messages.cn} conceptNote={cn} />}
              {type === PROJECT_TYPES.OPEN && role === ROLES.PARTNER
                && <AgencyClarificationAnswers id={id} />}
              {type === PROJECT_TYPES.OPEN && role === ROLES.PARTNER
                && <PartnerClarificationRequests id={id} />}
              {type === PROJECT_TYPES.OPEN && role === ROLES.AGENCY
                && <AgencyClarificationAnswers id={id} />}
              {type === PROJECT_TYPES.OPEN
                && <SelectionCriteria id={id} />}
              {role === ROLES.AGENCY && type === PROJECT_TYPES.OPEN
                && <InformedPartners id={id} />}
              {role === ROLES.AGENCY && type === PROJECT_TYPES.DIRECT
                && <SelectedPartnersDirect id={id} />}
              {role === ROLES.AGENCY && type === PROJECT_TYPES.DIRECT && isComplete
                && <SelectedPartnerJustification id={id} />}
              {role === ROLES.AGENCY && type === PROJECT_TYPES.OPEN && isComplete
                && agency !== agencyId && <SelectedPartners id={id} />}
            </GridColumn>
          </Grid>
        </Grid>
      </GridColumn>
    </form>
  );
};

CfeiOverview.propTypes = {
  params: PropTypes.object,
  role: PropTypes.string,
  cn: PropTypes.string,
  cn_template: PropTypes.string,
  partner: PropTypes.string,
  partnerId: PropTypes.number,
  displayGoal: PropTypes.bool,
  isComplete: PropTypes.bool,
  loading: PropTypes.bool,
  agencyId: PropTypes.number,
  agency: PropTypes.number,
};

const formCfeiDetails = reduxForm({
  form: 'cfeiDetails',
  enableReinitialize: true,
})(CfeiOverview);

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.params.id);
  const {
    agency = null,
    cn = null,
    is_completed = null,
    partner_id = null,
    partner_name = null,
    cn_template = null,
    focal_points_detail = [],
  } = cfei || {};
  const applications = cfei && cfei.direct_selected_partners && cfei.direct_selected_partners.map(
    item => ({
      partner: [Number(item.partner_id)],
      ds_justification_select: item.ds_justification_select,
      justification_reason: item.justification_reason,
      ds_attachment: item.ds_attachment,
    }));

  return {
    initialValues: assoc('applications', applications, assoc('focal_points', pluck('name', focal_points_detail), cfei)),
    loading: state.cfeiDetails.status.loading,
    isComplete: is_completed,
    agency,
    cn,
    cn_template,
    partner: partner_name,
    partnerId: partner_id,
    role: state.session.role,
    displayGoal: true,
    cfei,
    agencyId: state.session.agencyId,
  };
};


export default connect(
  mapStateToProps,
)(formCfeiDetails);
