import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArrayForm from '../../../arrayForm';
import SelectForm from '../../../selectForm';
import { mapPartnersNamesToSelection } from '../../../../../store';
import JustificationField from './justificationField';
import JustificationSummary from './justificationSummary';

const Partners = (values, readOnly, ...props) => (member, index, fields) => {
  const chosenPartners = fields.getAll().map(field => field.partner);
  const ownPartner = fields.get(index).partner;
  const newValues = values.filter(value =>
    (ownPartner === value.value) || !(chosenPartners.includes(value.value)));
  return (<SelectForm
    fieldName={`${member}.partner`}
    label="Partner"
    values={newValues}
    readOnly={readOnly}
    {...props}
  />
  );
};

const Justification = (readOnly, ...props) => (member, index, fields) => (
  <div >
    <JustificationField
      name={member}
      disabled={!fields.get(index).partner}
      readOnly={readOnly}
      {...props}
    />
    <JustificationSummary
      name={member}
      disabled={!fields.get(index).partner}
      readOnly={readOnly}
      {...props}
    />

  </div>
);


const PartnersFieldArray = (props) => {
  const { partners, readOnly, ...other } = props;
  return (
    <ArrayForm
      label=""
      limit={partners.length}
      fieldName="applications"
      initial
      readOnly={readOnly}
      {...other}
      outerField={Partners(partners, readOnly, ...other)}
      innerField={Justification(readOnly, ...other)}
    />
  );
};

PartnersFieldArray.propTypes = {
  partners: PropTypes.arrayOf(
    PropTypes.objectOf(
      {
        value: PropTypes.string,
        label: PropTypes.string,
      },
    ),
  ),
  readOnly: PropTypes.bool,
};


export default connect(
  state => (
    { partners: mapPartnersNamesToSelection(state) }),
)(PartnersFieldArray);
