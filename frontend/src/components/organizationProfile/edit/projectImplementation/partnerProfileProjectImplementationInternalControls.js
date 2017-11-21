import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import RadioForm from '../../../forms/radioForm';
import TextFieldForm from '../../../forms/textFieldForm';
import { visibleIfYes, BOOL_VAL } from '../../../../helpers/formHelper';
import SelectForm from '../../../forms/selectForm';
import ArrayForm from '../../../forms/arrayForm';
import GridColumn from '../../../common/grid/gridColumn';
import { selectNormalizedPolicyArea, selectNormalizedFunctionalResponsibility } from '../../../../store';

const messages = {
  areaOfResponsibilityDesc: 'Area of Responsibility - Has the organization instituted safeguards to ensure the following functional responsibilities are appropriately segregated?',
  areaOfResponsibility: 'Area of Responsibility',
  segregationOf: 'Segregation of Duties',
  pleaseComment: 'Please comment',
  experiencedStaff: 'Does the organization have an adequate number of experienced staff responsible for financial management in all operations?',
  policyArea: 'Policy Area - Does the organization have formal documented policies applicable to all operations that cover the following areas?',
  selectArea: 'Select Area',
  documentedPolicies: 'Documented Policies?',
};

const InternalControls = (values, readOnly, ...props) => (member, index, fields) => {
  const chosenAreas = fields.getAll().map(field => field.area);
  const ownArea = fields.get(index).area;
  const newValues = values.filter(value =>
    (ownArea === value.value) || !(chosenAreas.includes(value.value)));

  return (
    <Grid container>
      <Grid item sm={6} xs={12}>
        <SelectForm
          fieldName={`${member}.functional_responsibility`}
          label={messages.areaOfResponsibility}
          values={newValues}
          readOnly
          optional
          warn
          {...props}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <RadioForm
          fieldName={`${member}.segregation_duties`}
          label={messages.segregationOf}
          values={BOOL_VAL}
          optional
          warn
          readOnly={readOnly}
        />
      </Grid>
    </Grid>
  );
};

const CommentInner = (readOnly, ...props) => member => (
  <TextFieldForm
    label={messages.pleaseComment}
    fieldName={`${member}.comment`}
    textFieldProps={{
      multiline: true,
      inputProps: {
        maxLength: '5000',
      },
    }}
    optional
    warn
    readOnly={readOnly}
    {...props}
  />
);

const PolicyArea = (values, readOnly, ...props) => (member, index, fields) => {
  const chosenAreas = fields.getAll().map(field => field.area);
  const ownArea = fields.get(index).area;
  const newValues = values.filter(value =>
    (ownArea === value.value) || !(chosenAreas.includes(value.value)));

  return (
    <Grid container>
      <Grid item sm={6} xs={12}>
        <SelectForm
          fieldName={`${member}.area`}
          label={messages.areaOfResponsibility}
          values={newValues}
          readOnly
          {...props}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <RadioForm
          fieldName={`${member}.document_policies`}
          label={messages.documentedPolicies}
          values={BOOL_VAL}
          warn
          readOnly={readOnly}
        />
      </Grid>
    </Grid>
  );
};

const PartnerProfileProjectImplementationInternalControls = (props) => {
  const { readOnly, experiencedStaff, policyArea, functionalResponsibility } = props;

  return (
    <FormSection name="internal_control">
      <GridColumn>
        <ArrayForm
          label={messages.policyArea}
          limit={functionalResponsibility.length}
          fieldName="internal_controls"
          initial
          disableDeleting
          readOnly={readOnly}
          outerField={InternalControls(functionalResponsibility, readOnly)}
          innerField={CommentInner(readOnly)}
        />
        <RadioForm
          fieldName="experienced_staff"
          label={messages.experiencedStaff}
          values={BOOL_VAL}
          warn
          readOnly={readOnly}
        />
        {visibleIfYes(experiencedStaff)
          ? <Grid item>
            <TextFieldForm
              label={messages.pleaseComment}
              fieldName="experienced_staff_desc"
              textFieldProps={{
                multiline: true,
                inputProps: {
                  maxLength: '5000',
                },
              }}
              warn
              readOnly={readOnly}
            />
          </Grid>
          : null}
        <ArrayForm
          label={messages.policyArea}
          limit={policyArea.length}
          fieldName="area_policies"
          disableDeleting
          initial
          readOnly={readOnly}
          outerField={PolicyArea(policyArea, readOnly)}
        />
      </GridColumn>
    </FormSection>
  );
};

PartnerProfileProjectImplementationInternalControls.propTypes = {
  readOnly: PropTypes.bool,
  experiencedStaff: PropTypes.bool,
  policyArea: PropTypes.array,
  functionalResponsibility: PropTypes.array,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    experiencedStaff: selector(state, 'project_impl.internal_control.experienced_staff'),
    policyArea: selectNormalizedPolicyArea(state),
    functionalResponsibility: selectNormalizedFunctionalResponsibility(state),
  }),
)(PartnerProfileProjectImplementationInternalControls);
