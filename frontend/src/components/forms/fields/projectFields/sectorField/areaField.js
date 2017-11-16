import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectForm from '../../../selectForm';

import { mapSpecializationsToSelection } from '../../../../../store';

const AreaField = (props) => {
  const { name, areas, disabled, ...other } = props;
  return (
    <SelectForm
      fieldName={`${name}.areas`}
      label="Area(s) of specialization"
      values={areas}
      selectFieldProps={{
        multiple: true,
        disabled,
      }}
      {...other}
    />
  );
};

AreaField.propTypes = {
  name: PropTypes.string,
  areas: PropTypes.arrayOf(
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
  (state, ownProps) => (
    { areas: ownProps.sectorId
      ? mapSpecializationsToSelection(state, ownProps.sectorId)
      : [],
    }),
)(AreaField);
