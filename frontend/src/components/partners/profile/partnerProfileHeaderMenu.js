
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import DropdownMenu from '../../common/dropdownMenu';
import DeactivateProfileButton from './buttons/deactivateProfileButton';

const PartnerProfileHeaderMenu = (props) => {
  const { params: { id } } = props;
  return (
    <DropdownMenu
      options={
        [
          {
            name: 'deactivateItem',
            content: <DeactivateProfileButton id={id} />,
          },
        ]
      }
    />
  );
};

PartnerProfileHeaderMenu.propTypes = {
  params: PropTypes.object,
};

export default withRouter(PartnerProfileHeaderMenu);
