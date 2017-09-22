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

const CfeiOverview = (props) => {
  const { params: { id } } = props;
  return (
    <form >
      <GridColumn >
        <Timeline id={id} />
        <Grid container direction="row">
          <Grid item xs={12} sm={8}>
            <ProjectDetails />
          </Grid>
          <Grid item xs={12} sm={4}>
            <GridColumn >
              <SelectionCriteria id={id} />
              <InformedPartners id={id} />
            </GridColumn>
          </Grid>
        </Grid>
      </GridColumn>
    </form>
  );
};

CfeiOverview.propTypes = {
  params: PropTypes.object,
};

const formCfeiDetails = reduxForm({
  form: 'cfeiDetails',
})(CfeiOverview);

const mapStateToProps = (state, ownProps) => ({
  initialValues: selectCfeiDetails(state, ownProps.params.id),
});

export default connect(
  mapStateToProps,
)(formCfeiDetails);
