import React from 'react';
import PropTypes from 'prop-types';

import { PROJECT_TYPES, ROLES } from '../../../../helpers/constants';
import PartnerOpenHeaderOptions from './partnerOpenHeaderOptions';
import AgencyOpenHeaderOptions from './agencyOpenHeaderOptions';

const renderHeaderOptions = (role, type) => {
  if (type === PROJECT_TYPES.OPEN) {
    if (role === ROLES.AGENCY) {
      return <AgencyOpenHeaderOptions />;
    } else if (role === ROLES.PARTNER) {
      return <PartnerOpenHeaderOptions />;
    }
  }
};

const HeaderOptionsContainer = (props) => {
  const { role, type } = props;
  return (<div>
    {renderHeaderOptions(role, type)}
  </div>);
};

HeaderOptionsContainer.propTypes = {
  role: PropTypes.string,
  type: PropTypes.string,
};

export default HeaderOptionsContainer;
