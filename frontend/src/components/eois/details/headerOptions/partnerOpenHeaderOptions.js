import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Grid from 'material-ui/Grid';
import DropdownMenu from '../../../common/dropdownMenu';
import PinnedCell from '../../cells/pinnedCell';
import DownloadButton from '../../buttons/downloadCfeiButton';
import PinButton from '../../buttons/pinItemButton';
import { checkPermission, PARTNER_PERMISSIONS } from '../../../../helpers/permissions';
import { authorizedFileDownload } from "../../../../helpers/api/api";

const download = 'download';

let dropdownOptions = [
  {
    name: download,
    content: <DownloadButton handleClick={() => { authorizedFileDownload({ uri: `/projects/${id}/?export=pdf` }); }} />,
  },
]

const PartnerOpenHeaderOptions = (props) => {
  const { params: { id }, hasPermission } = props;

  if (hasPermission) {
    dropdownOptions.push(
      {
        name: 'pinItem',
        content: <PinButton id={id} />,
      });
  }

  return (
    <Grid container direction="row" alignItems="center" wrap="nowrap" spacing={0}>
      <Grid item>
        <PinnedCell id={id} />
      </Grid>
      <Grid item>
        <DropdownMenu
          options={
            dropdownOptions
          }
        />
      </Grid>
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
