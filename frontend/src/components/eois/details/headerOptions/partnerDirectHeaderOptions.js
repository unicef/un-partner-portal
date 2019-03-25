import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
import DropdownMenu from '../../../common/dropdownMenu';
import SpreadContent from '../../../common/spreadContent'; 
import DownloadButton from '../../buttons/downloadCfeiButton';
import { authorizedFileDownload } from "../../../../helpers/api/api";

const download = 'download';

class PartnerDirectHeaderOptions extends Component {
  constructor(props) {
    super(props);

    this.options = this.options.bind(this);
  }

  options() {
    const {
      params: { id } } = this.props;

    return [
      {
        name: download,
        content: <DownloadButton handleClick={() => { authorizedFileDownload({uri: `/projects/${id}/?export=pdf`}); }} />,
      },
    ];
  }

  render() {
    return (
      <SpreadContent>
        <DropdownMenu
          options={this.options()}
        />
      </SpreadContent>
    );
  }
}

PartnerDirectHeaderOptions.propTypes = {
  params: PropTypes.object,
};

export default compose(
  withRouter,
)(PartnerDirectHeaderOptions);
