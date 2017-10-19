import React from 'react';
import PropTypes from 'prop-types';

const eoiPartnersCell = (props) => {
  const { partners } = props;
  return (
    <div>
      { partners.map(partner => (
        `${partner.partner.legal_name}, `
      ))
      }
    </div>
  );
};

eoiPartnersCell.propTypes = {
  partners: PropTypes.string.isRequired,
};

export default eoiPartnersCell;
