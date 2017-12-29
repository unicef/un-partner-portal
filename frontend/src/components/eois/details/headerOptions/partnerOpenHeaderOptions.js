import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Grid from 'material-ui/Grid';
import DropdownMenu from '../../../common/dropdownMenu';
import PinnedCell from '../../cells/pinnedCell';
import PinButton from '../../buttons/pinItemButton';

const PartnerOpenHeaderOptions = (props) => {
  const { params: { id } } = props;

  return (
    <Grid container direction="row" alignItems="center" wrap="nowrap" spacing={0}>
      <Grid item>
        <PinnedCell id={id} />
      </Grid>
      <Grid item>
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
      </Grid>
    </Grid>
  );
};

PartnerOpenHeaderOptions.propTypes = {
  params: PropTypes.object,
};

export default withRouter(PartnerOpenHeaderOptions);
