import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import DropdownMenu from '../../../common/dropdownMenu';
import EditButton from '../../buttons/editCfeiButton';
import InviteButton from '../../buttons/invitePartner';
import Reviewers from '../../buttons/manageReviewers';
import Duplicate from '../../buttons/duplicateButton';

const PartnerOpenHeaderOptions = (props) => {
  const { params: { id } } = props;
  return (
    <DropdownMenu
      options={
        [
          {
            name: 'edit',
            content: <EditButton id={id} />,
          },
          {
            name: 'invite',
            content: <InviteButton id={id} />,
          },
          {
            name: 'manage',
            content: <Reviewers id={id} />,
          },
          {
            name: 'duplicate',
            content: <Duplicate id={id} />,
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
