import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectForm from '../../../selectForm';
import { mapPartnersNamesToSelection } from '../../../../../store';

const messages = {
  label: 'Partners',
};

const ProjectPartners = (props) => {
  const { name, partners, ...other } = props;
  return (
    <SelectForm
      fieldName="invited_partners"
      label={messages.label}
      values={partners}
      selectFieldProps={{
        multiple: true,
      }}
      {...other}
    />
  );
};

ProjectPartners.propTypes = {
  name: PropTypes.string,
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
