
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { pluck } from 'ramda';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';

import * as fields from '../../../forms/fields/projectFields/commonFields';
import GridColumn from '../../../common/grid/gridColumn';

import ProjectDetails from '../editDsr/ProjectDetails';
import PartnersForm from '../../../forms/fields/projectFields/partnersField/partnersFieldArray';
import { selectCfeiDetails } from '../../../../store';

const messages = {
  selectPartners: 'Select Partner',
  selectionCriteria: 'Selection Criteria',
};

const EditDirectForm = (props) => {
  const {
    handleSubmit,
    startDate,
    cfeiDetails,
    partner,
    focalPointNameArray } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <ProjectDetails
          cfeiDetails={cfeiDetails}
          formName="editDsr"
          focalPoints={focalPointNameArray}
        >
          <fields.StartDate />
          <fields.EndDate minDate={startDate} />
        </ProjectDetails>
        <Typography type="headline">
          {messages.selectPartners}
        </Typography>
        <PartnersForm partnername={partner} />
      </GridColumn>
    </form >
  );
};

EditDirectForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  startDate: PropTypes.string,
  partner: PropTypes.string,
  focalPointName: PropTypes.array,
  cfeiDetails: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);
  const cfeiStartDate = cfei.start_date;
  const focalPoints = cfei.focal_points_detail.map(item => item.id);
  const focalPointNameArray = cfei.focal_points_detail.map(item => item.name);
  const partner = String(cfei.direct_selected_partners.map(item => item.partner_name));
  const applications = cfei.direct_selected_partners.map(item => ({
    partner: Number(item.partner_id),
    ds_justification_select: item.ds_justification_select,
    justification_reason: item.justification_reason,
    ds_attachment: item.ds_attachment,
  }));
  console.log(focalPoints, focalPointNameArray, partner, applications);
  
  return {
    startDate: cfeiStartDate,
    cfeiDetails: cfei,
    partner,
    focalPointNameArray,
    initialValues: {
      title: cfei.title,
      applications,
      specializations: cfei.specializations,
      focal_points: focalPoints,
      description: cfei.description,
      goal: cfei.goal,
      start_date: cfei.start_date,
      end_date: cfei.end_date,
      other_information: cfei.other_information,
      countries: cfei.cfei_locations,
    },
  };
};

const formEditDsr = reduxForm({
  form: 'editDsr',
})(EditDirectForm);

export default connect(
  mapStateToProps,
)(formEditDsr);
