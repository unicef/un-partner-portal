import React from 'react';
import PropTypes from 'prop-types';
import { formValueSelector, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import GridColumn from '../../../common/grid/gridColumn';
import { visibleIfYes, BOOL_VAL } from '../../../../helpers/formHelper';
import RadioForm from '../../../forms/radioForm';
import SelectForm from '../../../forms/selectForm';
import { selectNormalizedPopulationsOfConcernGroups } from '../../../../store';
import { placeholders } from '../partnerProfileEdit';

const messages = {
  populationOfConcern: 'Does your organization work with populations of concern as defined by UNHCR?',
  concernGroups: 'Please indicate which group(s)',
};

const PartnerProfileMandatePopulation = (props) => {
  const { readOnly, populationOfConcern, populationsOfConcernGroups } = props;

  return (
    <FormSection name="populations_of_concern">
      <GridColumn>
        <RadioForm
          fieldName="population_of_concern"
          label={messages.populationOfConcern}
          values={BOOL_VAL}
          warn
          optional
          readOnly={readOnly}
        />
        {visibleIfYes(populationOfConcern)
        && <SelectForm
          fieldName="concern_groups"
          label={messages.concernGroups}
          values={populationsOfConcernGroups}
          multiple
          placeholder={placeholders.select}
          warn
          optional
          readOnly={readOnly}
        />}
      </GridColumn>
    </FormSection>
  );
};

PartnerProfileMandatePopulation.propTypes = {
  readOnly: PropTypes.bool,
  populationOfConcern: PropTypes.bool,
  populationsOfConcernGroups: PropTypes.array.isRequired,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    populationOfConcern: selector(state, 'mandate_mission.populations_of_concern.population_of_concern'),
    populationsOfConcernGroups: selectNormalizedPopulationsOfConcernGroups(state),
  }),
)(PartnerProfileMandatePopulation);
