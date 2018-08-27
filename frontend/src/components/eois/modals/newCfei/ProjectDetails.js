import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
  const { children, formName, displayPopulation } = props;

  return (
    <GridColumn>
      <Typography type="headline">
        {messages.projectDetails}
      </Typography>
      <GridColumn>
        <fields.TitleField />
        <LocationForm formName={formName} />
        <fields.FocalPoint formName={formName} />
        <SectorForm />
        {displayPopulation && <SelectPopulationOfConcern />}
        <fields.Background />
        <fields.Goal />
        <fields.OtherInfo />
        <GridRow columns={3} >
          {children}
        </GridRow>
        <fields.Attachments />
      </GridColumn>
    </GridColumn>

  );
};

ProjectDetails.propTypes = {
  /**
   * array of date pickers
   */
  formName: PropTypes.string,
  displayPopulation: PropTypes.bool,

};
const mapStateToProps = state => ({
  displayPopulation: state.session.agencyName === 'UNHCR',
});

export default connect(mapStateToProps)(ProjectDetails);
