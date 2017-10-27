import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import GridColumn from '../../../common/grid/gridColumn';
import Timeline from './timeline';
import ProjectDetails from './projectDetails';
import SelectionCriteria from './selectionCriteria';
import InformedPartners from './informedPartners';
import { selectCfeiDetails } from '../../../../store';
import { ROLES, PROJECT_TYPES } from '../../../../helpers/constants';
import ConceptNote from './conceptNote';

const messages = {
  cn: 'Concept Note Template',
};

const CfeiOverview = (props) => {
  const { params: { id, type }, role, cn, partner } = props;
  return (
    <form >
      <GridColumn >
        {type === PROJECT_TYPES.OPEN && <Timeline id={id} />}
        <Grid container direction="row">
          <Grid item xs={12} sm={8}>
            <ProjectDetails type={type} role={role} partner={partner} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <GridColumn >
              {role === ROLES.PARTNER
                && type === PROJECT_TYPES.OPEN
                && <ConceptNote title={messages.cn} conceptNote={cn} />}
              {type === PROJECT_TYPES.OPEN
                && <SelectionCriteria id={id} />}
              {role === ROLES.AGENCY && type !== PROJECT_TYPES.UNSOLICITED
                && <InformedPartners id={id} />}
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
};

const formCfeiDetails = reduxForm({
  form: 'cfeiDetails',
  enableReinitialize: true,
})(CfeiOverview);

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.params.id);
  const { cn = null, partner_name = null } = cfei ? cfei : {};
  return {
    initialValues: selectCfeiDetails(state, ownProps.params.id),
    cn,
    partner: partner_name,
    role: state.session.role,
  };
};


export default connect(
  mapStateToProps,
)(formCfeiDetails);
