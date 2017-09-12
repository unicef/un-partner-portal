
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import DropdownMenu from '../../../common/dropdownMenu';
import AddNewVerificationButton from '../buttons/addNewVerificationButton';

const PartnerOverviewVerificationMenu = (props) => {
  const { params: { id } } = props;
  return (
    <DropdownMenu
      options={
        [
          {
            name: 'addNewVerification',
            content: <AddNewVerificationButton id={id} />,
          },
        ]
      }
    />
  );
};

PartnerOverviewVerificationMenu.propTypes = {
  params: PropTypes.object,
};

export default withRouter(PartnerOverviewVerificationMenu);
