import React from 'react';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import VerifiedUser from 'material-ui-icons/VerifiedUser';
import Flag from 'material-ui-icons/Flag';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import PartnerProfileHeader from './partnerProfileHeader';
import HeaderNavigation from '../../../components/common/headerNavigation';


const styleSheet = createStyleSheet('CountryOfficesHeader', (theme) => {
  const paddingIcon = theme.spacing.unit;

  return {
    alignCenter: {
      display: 'flex',
      alignItems: 'center',
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
      width: 20,
      height: 20,
      margin: `0 ${paddingIcon}px 0 0`,
    },
    iconRed: {
      fill: '#D50000',
      width: 20,
      height: 20,
      margin: `0 ${paddingIcon}px 0 0`,
    },
  };
});

const messages = {
  header: 'Partner 0',
};

const PartnerTitle = (props) => {
  const { classes, partner } = props;

  return (
    <div className={classes.alignCenter}>
      <Typography type="headline">
        {messages.header}
      </Typography>
      <VerifiedUser className={partner.verified ? classes.iconVerified : classes.iconNotVerified} />
      {partner.flagYellow && <Flag className={classes.iconYellow} />}
      {partner.flagRed && <Flag className={classes.iconRed} />}
    </div>);
};

const PartnerProfile = (props) => {
  const { tabs, children } = props;
  return (
    <div>
      <HeaderNavigation
        backButton
        tabs={tabs}
        children={children}
        handleBackButton={() => { history.goBack(); }}
        header={<PartnerProfileHeader handleMoreClick={() => { }} />}
        titleObject={PartnerTitle(props)}
      />
    </div>
  );
};

PartnerProfile.propTypes = {
  tabs: PropTypes.array.isRequired,
  children: PropTypes.node,
};

PartnerTitle.propTypes = {
  classes: PropTypes.object.isRequired,
  partner: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  tabs: state.agencyPartnerProfileNav.tabs,
  partner: state.agencyPartnerProfile[ownProps.params.id],
});

const mapDispatchToProps = () => ({
  onItemClick: (id, path) => {
    history.push(path);
  },
});

const connectedPartnerProfile = connect(mapStateToProps, mapDispatchToProps)(PartnerProfile);
const connectedPartnerTitle = connect(mapStateToProps, mapDispatchToProps)(PartnerTitle);
withStyles(styleSheet)(connectedPartnerTitle);

export default withStyles(styleSheet)(connectedPartnerProfile);

