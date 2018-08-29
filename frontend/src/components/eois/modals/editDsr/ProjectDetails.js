import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import SectorForm from '../../../forms/fields/projectFields/sectorField/sectorFieldArray';
import SelectPopulationOfConcern from '../../../forms/fields/newCfeiFields/selectPopulationOfConcern';
import * as fields from '../../../forms/fields/projectFields/commonFields';
import GridColumn from '../../../common/grid/gridColumn';
import GridRow from '../../../common/grid/gridRow';
import LocationForm from '../../../forms/fields/projectFields/locationField/locationFieldArray';

const messages = {
  projectDetails: 'Project Details',
};

const ProjectDetails = (props) => {
  const { children, formName, displayPopulation, focalPoints } = props;
  return (
    <GridColumn>
      <Typography type="headline">
        {messages.projectDetails}
      </Typography>
      <GridColumn>
        <fields.TitleField />
        <LocationForm formName={formName} />
        <fields.FocalPoint overlap={false} formName={formName} initialMultiValues={focalPoints} />
        <SectorForm />
        {displayPopulation && <SelectPopulationOfConcern />}
        <fields.Background />
        <fields.Goal />
        <fields.OtherInfo />
        <GridRow columns={3} >
          {children}
        </GridRow>
      </GridColumn>
    </GridColumn>
  );
};

ProjectDetails.propTypes = {
  displayPopulation: PropTypes.bool,
  formName: PropTypes.string,
  focalPoints: PropTypes.array,
};

export default ProjectDetails;

