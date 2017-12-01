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
import InformedPartners from './informedPartners';
import SelectedPartners from './selectedPartners/selectedPartnersContainer';
import { selectCfeiDetails } from '../../../../store';
import { ROLES, PROJECT_TYPES } from '../../../../helpers/constants';
import ConceptNote from './conceptNote';

const messages = {
  cn: 'Concept Note Template',
};

const CfeiOverview = (props) => {
  const { params: { id, type }, role, cn, partner, displayGoal } = props;
  return (
    <form >
      <GridColumn >
        {type === PROJECT_TYPES.OPEN && <Timeline id={id} />}
        <Grid container direction="row" spacing={24}>
          <Grid item xs={12} sm={8}>
            <ProjectDetails
              type={type}
              role={role}
              partner={partner}
              displayGoal={displayGoal}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <GridColumn >
              {role === ROLES.PARTNER
                && type === PROJECT_TYPES.OPEN
                && <ConceptNote title={messages.cn} conceptNote={cn} />}
              {type === PROJECT_TYPES.OPEN
                && <SelectionCriteria id={id} />}
              {role === ROLES.AGENCY && type === PROJECT_TYPES.OPEN
                && <InformedPartners id={id} />}
              {role === ROLES.AGENCY && type === PROJECT_TYPES.DIRECT
                && <SelectedPartners id={id} />}
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
  partner: PropTypes.number,
  displayGoal: PropTypes.bool,
};

const formCfeiDetails = reduxForm({
  form: 'cfeiDetails',
  enableReinitialize: true,
})(CfeiOverview);

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.params.id);
  const { cn = null,
    partner_name = null,
    selected_source = null,
    focal_points_detail = [],
  } = cfei || {};
  return {
    initialValues: assoc('focal_points', pluck('name', focal_points_detail), cfei),
    cn,
    partner: partner_name,
    role: state.session.role,
    displayGoal: selected_source === 'UNI',
  };
};


export default connect(
  mapStateToProps,
)(formCfeiDetails);
