import React from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import * as fields from '../../../forms/fields/projectFields/commonFields';
import GridColumn from '../../../common/grid/gridColumn';
import SectorForm from '../../../forms/fields/projectFields/sectorField/sectorFieldArray';
import LocationForm from '../../../forms/fields/projectFields/locationField/locationFieldArray';
import CnFileSection from '../../details/submission/cnFileSection';
import FileForm from '../../../forms/fileForm';
import Agencies from '../../../forms/fields/projectFields/agencies';
import ProfileConfirmation from '../../../organizationProfile/common/profileConfirmation';
import { selectCfeiDetails } from '../../../../store';

const messages = {
  cn: 'Concept Note',
  projectDetails: 'Project Details',
  cnLabel: 'Please ensure that you have used the concept note template provided by the UN agency to whom you are submitting this unsolicited concept note.',
};

const EditUcnForm = (props) => {
  const { handleSubmit, form, handleConfirmation } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <Typography type="headline">
          {messages.projectDetails}
        </Typography>
        <Agencies fieldName="agency" />
        <fields.TitleField />
        <LocationForm formName="editUcn" />
        <SectorForm />
        <Typography type="headline">
          {messages.cn}
        </Typography>
        <CnFileSection
          component={<FileForm
            fieldName="cn"
          />}
          label={messages.cnLabel}
          displayHint={false}
        />
        <ProfileConfirmation onChange={handleConfirmation} />
      </GridColumn>
    </form >
  );
};

EditUcnForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.string,
  handleConfirmation: PropTypes.func,

};

const mapStateToProps = (state, ownProps) => {
  const ucn = selectCfeiDetails(state, ownProps.id);
  const title = ucn.title;
  const agency = ucn.agency_id;
  const countries = ucn.locations;
  const specializations = ucn.specializations;
  const cn = ucn.cn;
  return {
    agency,
    initialValues: {
      title,
      agency,
      countries,
      specializations,
      cn,
    },
  };
};

const formEditUcn = reduxForm({
  form: 'editUcn',
})(EditUcnForm);

export default connect(
  mapStateToProps,
)(formEditUcn);
