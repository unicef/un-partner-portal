import React from 'react';
import PropTypes from 'prop-types';

import withCountryName from '../../common/hoc/withCountryName';

const eoiCountryCell = (props) => {
  const { countryName } = props;
  
  return (
    <div>
      {countryName}
    </div>
  );
};

eoiCountryCell.propTypes = {
  countryName: PropTypes.string.isRequired,
};

export default withCountryName(eoiCountryCell);
