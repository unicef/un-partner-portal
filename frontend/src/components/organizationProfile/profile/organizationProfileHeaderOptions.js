import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import DropdownMenu from '../../common/dropdownMenu';
import PrintButton from '../buttons/printButton';


const OrganizationProfileHeaderOptions = (props) => {
  const { params: { id } } = props;
  return (
    <DropdownMenu
      options={
        [
          {
            name: 'print',
            content: <PrintButton id={id} />,
          },
        ]
      }
    />
  );
};

OrganizationProfileHeaderOptions.propTypes = {
  params: PropTypes.object,
};

export default withRouter(OrganizationProfileHeaderOptions);
