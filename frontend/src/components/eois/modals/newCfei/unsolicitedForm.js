import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import * as fields from '../../../forms/fields/projectFields/commonFields';
import GridColumn from '../../../common/grid/gridColumn';
import SectorForm from '../../../forms/fields/projectFields/sectorField/sectorFieldArray';
import LocationForm from '../../../forms/fields/projectFields/locationField/locationFieldArray';
import CnFileSection from '../../details/submission/cnFileSection';
import FileForm from '../../../forms/fileForm';
import AgencySelectField from '../../../forms/fields/projectFields/agencies';
import ProfileConfirmation from '../../../organizationProfile/common/profileConfirmation';

const messages = {
  cn: 'Concept Note',
  projectDetails: 'Project Details',
  agency: 'Agency',
};

const OpenForm = (props) => {
  const { handleSubmit, form, handleConfirmation } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <Typography type="headline">
          {messages.projectDetails}
        </Typography>
        <AgencySelectField
          fieldName="agency"
          label={messages.agency}
        />
        <fields.TitleField />
        <LocationForm formName={form} />
        <SectorForm />
        <Typography type="headline">
          {messages.cn}
        </Typography>
        <CnFileSection
          component={<FileForm
            fieldName="cn"
          />}
          displayHint={false}
        />
      </GridColumn>
      <ProfileConfirmation onChange={handleConfirmation} />
    </form >
  );
};

OpenForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.string,
  handleConfirmation: PropTypes.func,

};

export default reduxForm({
  form: 'newUnsolicitedCN',
  touchOnChange: true,
})(OpenForm);
