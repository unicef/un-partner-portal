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
  const { dateFields, formName } = props;
  return (
    <GridColumn>
      <Typography type="headline">
        {messages.projectDetails}
      </Typography>
      <GridColumn>
        <fields.TitleField />
        <LocationForm formName={formName} />
        <fields.FocalPoint />
        <SectorForm />
        <SelectPopulationOfConcern />
        <fields.Background />
        <fields.OtherInfo />
        <GridRow columns={4} >
          {dateFields}
        </GridRow>
      </GridColumn>
    </GridColumn>

  );
};

ProjectDetails.propTypes = {
  /**
   * array of date pickers
   */
  dateFields: PropTypes.array,
  formName: PropTypes.string,

};

export default ProjectDetails;
