import React from 'react';
import Grid from 'material-ui/Grid';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import GridColumn from '../../common/grid/gridColumn';
import Timeline from './timeline';
import ProjectDetails from './projectDetails';
import SelectionCriteria from './selectionCriteria';
import InformedPartners from './informedPartners';

const CfeiDetails = (props) => {
  const {params:{id}} = props;
  return (
    <form >
      <GridColumn >
        <Timeline />
        <Grid container direction="row">
          <Grid item xs={12} sm={8}>
            <ProjectDetails />
          </Grid>
          <Grid item xs={12} sm={4}>
            <GridColumn >
              <SelectionCriteria id={id} />
              <InformedPartners />
            </GridColumn>
          </Grid>
        </Grid>
      </GridColumn>
    </form>
  );
};

const formCfeiDetails = reduxForm({
  form: 'cfeiDetails',
})(CfeiDetails);

const mapStateToProps = (state, ownProps) => ({
  initialValues: state.cfeiDetails[ownProps.params.id],
});

export default connect(
  mapStateToProps,
)(formCfeiDetails);
