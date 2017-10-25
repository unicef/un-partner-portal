import PropTypes from 'prop-types';
import React from 'react';
import VerifiedUser from 'material-ui-icons/VerifiedUser';
import Flag from 'material-ui-icons/Flag';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import PaddedContent from '../../../../common/paddedContent';
import OrganizationProfileOverview from '../../../../organizationProfile/profile/organizationProfileOverview';

const styleSheet = (theme) => {
  const padding = theme.spacing.unit * 4;
  const paddingIcon = theme.spacing.unit;

  return {
    root: {
      minWidth: '590px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: theme.palette.primary[400],
      padding: `0 ${padding}px 0 ${padding}px`,
    },
    iconNotVerified: {
      fill: theme.palette.primary[500],
      width: 20,
      height: 20,
      margin: `0 0 0 ${paddingIcon}px`,
    },
    iconVerified: {
      fill: '#009A54',
      width: 20,
      height: 20,
      margin: `0 0 0 ${paddingIcon}px`,
    },
    iconYellow: {
      fill: '#FFC400',
      width: 15,
      height: 15,
      margin: `0 0 0 ${paddingIcon}px`,
    },
    iconRed: {
      fill: '#D50000',
      width: 15,
      height: 15,
      margin: `0 0 0 ${paddingIcon}px`,
    },
  };
};

const OrganizationProfileContent = (props) => {
  const { classes, verifiedStatus, flag, profileName } = props;

  return (
    <div>
      <PaddedContent big>
        <div className={classes.root}>
          <Typography type="headline"> {profileName}</Typography>
          {<VerifiedUser
            className={classNames({
              [classes.iconVerified]: verifiedStatus,
              [classes.iconNotVerified]: !verifiedStatus,
            })}
          />}
          {flag ? <Flag /> : null}
        </div>
      </PaddedContent>
      <OrganizationProfileOverview />
    </div>
  );
};

OrganizationProfileContent.propTypes = {
  classes: PropTypes.object.isRequired,
  profileName: PropTypes.func.isRequired,
  flag: PropTypes.string.isRequired,
  verifiedStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  profileName: state.psession.name,
  verifiedStatus: state.partnerInfo.partner.verified,
});

const connectedOrganizationProfileContent = connect(
  mapStateToProps, null)(OrganizationProfileContent);

export default withStyles(styleSheet, { name: 'OrganizationProfileContent' })(connectedOrganizationProfileContent);
