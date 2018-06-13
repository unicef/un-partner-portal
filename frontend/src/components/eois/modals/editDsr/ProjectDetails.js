import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { pluck } from 'ramda';

import Typography from 'material-ui/Typography';
import SectorForm from '../../../forms/fields/projectFields/sectorField/sectorFieldArray';
import SelectPopulationOfConcern from '../../../forms/fields/newCfeiFields/selectPopulationOfConcern';
import * as fields from '../../../forms/fields/projectFields/commonFields';
import GridColumn from '../../../common/grid/gridColumn';
import GridRow from '../../../common/grid/gridRow';
import LocationForm from '../../../forms/fields/projectFields/locationField/locationFieldArray';
import cfei from '../../../../reducers/cfei';

const messages = {
  projectDetails: 'Project Details',
};

const ProjectDetails = (props) => {
  const { children, formName, displayPopulation, cfeiDetails, focalPoints } = props;
  return (
    <GridColumn>
      <Typography type="headline">
        {messages.projectDetails}
      </Typography>
      <GridColumn>
        <fields.TitleField />
        <LocationForm formName={formName} />
        <fields.FocalPoint overlap={false} initialMultiValues={focalPoints} />
        <SectorForm />
        {displayPopulation && <SelectPopulationOfConcern />}
        <fields.Background />
        <fields.Goal />
        <fields.OtherInfo />
        <GridRow columns={4} >
          {children}
        </GridRow>
      </GridColumn>
    </GridColumn>

  );
};

ProjectDetails.propTypes = {
  displayPopulation: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  const cfeidetails = ownProps.cfeiDetails;
  const focalpoints = pluck('name', cfeidetails.focal_points_detail);
  return {
    focalPoints: focalpoints,
  };
};

export default connect(mapStateToProps)(ProjectDetails);

