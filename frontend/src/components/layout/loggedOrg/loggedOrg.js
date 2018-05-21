import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { browserHistory as history, withRouter } from 'react-router';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import GridColumn from '../../common/grid/gridColumn';
import { ROLES } from '../../../helpers/constants';
import PartnerSwitch from './partnerSwitch';
import AgencySwitch from './agencySwitch';

const messages = {
  logged: 'Logged in as:',
};

function loggedOrg(props) {
  const { role, name, logo } = props;
  return (
    <GridColumn>
      <Typography type="caption">
        {messages.logged}         {name} 

      </Typography>
      {logo && <img alt={name} src={logo} />}
      {role === ROLES.AGENCY && <AgencySwitch />}
      {role === ROLES.PARTNER && <PartnerSwitch />}
    </GridColumn>
  );
}

loggedOrg.propTypes = {
  name: PropTypes.string,
  role: PropTypes.string,
  logo: PropTypes.string,
};

const mapStateToProps = state => ({
  name: state.session.agencyName || state.session.partnerName,
  logo: state.session.logoThumbnail,
  role: state.session.role,
});

export default connect(
  mapStateToProps,
)(loggedOrg);

