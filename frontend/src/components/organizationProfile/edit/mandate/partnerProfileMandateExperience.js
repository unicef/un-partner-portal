import React from 'react';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArrayForm from '../../../forms/arrayForm';
import SelectForm from '../../../forms/selectForm';
import { mapSectorsToSelection, selectNormalizedYearsOfExperience } from '../../../../store';
import AreaField from '../../../forms/fields/projectFields/sectorField/areaField';

const messages = {
  sector: 'Sector',
  sectorsAndSpecialization: 'Sectors, areas of specialization, and years of experience',
  years: 'Years of experience',
};

const Sector = (values, yearsOfExp, readOnly, ...props) => (member, index, fields) => {
  const chosenSectors = fields.getAll().map(field => field.sector);
  const ownSector = fields.get(index).sector;
  const newValues = values.filter(value =>
    (ownSector === value.value) || !(chosenSectors.includes(value.value)));

  return (<Grid container direction="row">
    <Grid item sm={8} xs={12}>
      <SelectForm
        fieldName={`${member}.sector`}
        label={messages.sector}
        values={newValues}
        readOnly={readOnly}
        warn
        {...props}
      />
    </Grid>
    <Grid item sm={4} xs={12}>
      <SelectForm
        fieldName={`${member}.years`}
        label={messages.years}
        values={yearsOfExp}
        readOnly={readOnly}
        warn
        {...props}
      />
    </Grid>
  </Grid>
  );
};

const Area = (readOnly, ...props) => (member, index, fields) => (
  <AreaField
    name={member}
    disabled={!fields.get(index).sector}
    sectorId={fields.get(index).sector}
    readOnly={readOnly}
    warn
    {...props}
  />
);

const PartnerProfileMandateExperience = (props) => {
  const { readOnly, sectors, yearsOfExp } = props;

  return (
    <FormSection name="experience">
      <Grid item>
        <ArrayForm
          label={messages.sectorsAndSpecialization}
          limit={sectors.length}
          fieldName="specializations"
          initial
          readOnly={readOnly}
          outerField={Sector(sectors, yearsOfExp, readOnly)}
          innerField={Area(readOnly)}
        />
      </Grid>
    </FormSection>
  );
};

PartnerProfileMandateExperience.propTypes = {
  readOnly: PropTypes.bool,
  yearsOfExp: PropTypes.array,
  sectors: PropTypes.arrayOf(
    PropTypes.objectOf(
      {
        value: PropTypes.string,
        label: PropTypes.string,
      },
    ),
  ),
};

export default connect(
  state => (
    { sectors: mapSectorsToSelection(state),
      yearsOfExp: selectNormalizedYearsOfExperience(state) }),
)(PartnerProfileMandateExperience);
