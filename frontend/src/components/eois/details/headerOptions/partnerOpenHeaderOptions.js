import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import DropdownMenu from '../../../common/dropdownMenu';
import PinButton from '../../buttons/pinItemButton';


const PartnerOpenHeaderOptions = (props) => {
  const { params: { id } } = props;
  return (
    <DropdownMenu
      options={
        [
          {
            name: 'pinItem',
            content: <PinButton id={id} />,
          },
        ]
      }
    />
  );
};

PartnerOpenHeaderOptions.propTypes = {
  params: PropTypes.object,
};

export default withRouter(PartnerOpenHeaderOptions);
