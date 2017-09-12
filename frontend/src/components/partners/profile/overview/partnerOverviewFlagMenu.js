
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import DropdownMenu from '../../../common/dropdownMenu';
import FlagYellowButton from '../buttons/flagYellowButton';
import FlagRedButton from '../buttons/flagRedButton';

const PartnerOverviewFlagMenu = (props) => {
  const { params: { id } } = props;
  return (
    <DropdownMenu
      options={
        [
          {
            name: 'flagYellow',
            content: <FlagYellowButton id={id} />,
          },
          {
            name: 'flagRed',
            content: <FlagRedButton id={id} />,
          },
        ]
      }
    />
  );
};

PartnerOverviewFlagMenu.propTypes = {
  params: PropTypes.object,
};

export default withRouter(PartnerOverviewFlagMenu);
