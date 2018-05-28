import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Grid from 'material-ui/Grid';
import DropdownMenu from '../../../common/dropdownMenu';
import PinnedCell from '../../cells/pinnedCell';
import PinButton from '../../buttons/pinItemButton';
import { checkPermission, PARTNER_PERMISSIONS } from '../../../../helpers/permissions';

const PartnerOpenHeaderOptions = (props) => {
  const { params: { id }, hasPermission } = props;

  return (
    <Grid container direction="row" alignItems="center" wrap="nowrap" spacing={0}>
      <Grid item>
        <PinnedCell id={id} />
      </Grid>
      {hasPermission && <Grid item>
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
      </Grid>}
    </Grid>
  );
};

PartnerOpenHeaderOptions.propTypes = {
  hasPermission: PropTypes.bool.isRequired,
  params: PropTypes.object,
};

const mapStateToProps = state => ({
  hasPermission: checkPermission(PARTNER_PERMISSIONS.CFEI_PINNING, state),
});

const ContainerPartnerOpenHeaderOptions = connect(
  mapStateToProps,
)(PartnerOpenHeaderOptions);

export default withRouter(ContainerPartnerOpenHeaderOptions);
