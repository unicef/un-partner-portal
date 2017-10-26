import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectForm from '../../../selectForm';
import { mapPartnersNamesToSelection } from '../../../../../store';

const ProjectPartners = (props) => {
  const { fieldName, label, partners, ...other } = props;
  return (
    <SelectForm
      fieldName={fieldName}
      label={label}
      values={partners}
      selectFieldProps={{
        multiple: true,
      }}
      {...other}
    />
  );
};

ProjectPartners.propTypes = {
  fieldName: PropTypes.string,
  label: PropTypes.string,
  partners: PropTypes.arrayOf(
    PropTypes.objectOf(
      {
        value: PropTypes.string,
        label: PropTypes.string,
      },
    ),
  ),
  disabled: PropTypes.bool,
};

export default connect(
  state => (
    { partners: mapPartnersNamesToSelection(state) }),
)(ProjectPartners);
