import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import PaddedContent from '../../../../common/paddedContent';
import SpreadContent from '../../../../common/spreadContent';
import { formatDateForPrint } from '../../../../../helpers/dates';
import { isUserAgencyAdmin } from '../../../../../helpers/authHelpers';
import { updatePartnerFlags } from '../../../../../reducers/partnerFlags';
import FlagIcon from '../../icons/flagIcon';

const messages = {
  edit: 'edit',
  save: 'save',
  cancel: 'cancel',
  flag: 'Flag',
  by: 'by',
  you: 'you',
  valid: 'This flag is no longer valid',
};

const styleSheet = theme => ({
  lightGrey: {
    width: '100%',
    background: theme.palette.common.lightGreyBackground,
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center',
  },
  spacing: {
    marginLeft: theme.spacing.unit,
  },
});

class SingleFlagSummaryHeader extends Component {
  constructor() {
    super();
    this.state = { expanded: false, valid: true, checked: false };
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }
  handleEditClick() {
    this.setState({ expanded: true });
  }

  handleCancelClick() {
    this.setState({ expanded: false });
  }

  handleSaveClick() {
    this.props.invalidateFlag();
    this.setState({ expanded: false });
  }

  handleCheck() {
    this.setState({ checked: !this.state.checked });
  }

  render() {
    const { displayEdit, flag, classes, isYou } = this.props;
    const { expanded, checked } = this.state;
    return (
      <div>
        <PaddedContent className={classes.lightGrey}>
          <SpreadContent>
            <div className={classes.flexBox}>
              <FlagIcon color={flag.flag_type} />
              <Typography>
                {messages.flag}
              </Typography>
            </div>
            <div className={classes.flexBox}>
              <Typography type="caption">
                {`${messages.by} ${flag.submitter.name} ${flag.submitter.agency_name} ` +
                  `${isYou ? `(${messages.you}) ` : ' '}`}
              </Typography>
              <Typography className={classes.spacing}>
                {formatDateForPrint(flag.created)}
              </Typography>
            </div>
          </SpreadContent>
          {!displayEdit && !flag.is_valid && <Typography>
            {messages.valid}
          </Typography>}
          {displayEdit &&
            <Grid container justify="flex-end">
              <Grid item>
                {expanded ?
                  <div>
                    <Grid container spacing={0} align="center">
                      <Grid item>
                        <Checkbox
                          checked={checked}
                          onChange={this.handleCheck}
                        />
                      </Grid>
                      <Grid item>
                        <Typography>
                          {messages.valid}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Button color="accent" onClick={this.handleCancelClick}>
                      {messages.cancel}
                    </Button>
                    <Button disabled={!checked} color="accent" onClick={this.handleSaveClick}>
                      {messages.save}
                    </Button>
                  </div>
                  : <Button color="accent" onClick={this.handleEditClick}>
                    {messages.edit}
                  </Button>
                }
              </Grid>
            </Grid>
          }
        </PaddedContent>
      </div>
    );
  }
}

SingleFlagSummaryHeader.propTypes = {
  classes: PropTypes.object,
  flag: PropTypes.object,
  displayEdit: PropTypes.bool,
  isYou: PropTypes.bool,
  invalidateFlag: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  isYou: (state.session.userId === ownProps.flag.submitter.id),
  displayEdit: (isUserAgencyAdmin(state) || (state.session.userId === ownProps.flag.submitter.id))
  && ownProps.flag.is_valid,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  invalidateFlag: () => dispatch(updatePartnerFlags(ownProps.params.id, { is_valid: false }, true)),
});

export default withRouter(connect(
  mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(SingleFlagSummaryHeader)));
