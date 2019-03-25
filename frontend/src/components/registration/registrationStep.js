import React from 'react';
import { reduxForm, clearSubmitErrors } from 'redux-form';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import Typography from 'material-ui/Typography';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

const messages = {
  continue: 'Continue',
  register: 'Register',
  cancel: 'Cancel',
  terms: <div>{'I have read and agree to the '}
    <a href="https://unpartnerportalcso.zendesk.com/hc/en-us/article_attachments/360017929314/UN_Partner_Portal_Privacy_Policy_.pdf">{'Terms of Use'}</a>
    {' and '}<a href="https://unpartnerportalcso.zendesk.com/hc/en-us/article_attachments/360018648633/UN_Partner_Portal_Terms_of_Use.pdf">{'Privacy Policy'}</a> {'on UN Partner Portal'}</div>,
};

const styleSheet = () => ({
  buttonContainer: {
    marginTop: 8,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
  },
});

class RegistrationStep extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      termsOfUse: false,
    };

    this.handleCheck = this.handleCheck.bind(this);
  }

  handleCheck() {
    this.setState({ termsOfUse: !this.state.termsOfUse });
  }

  termsOfUse() {
    const { classes } = this.props;

    return (<div className={classes.center}>
      <Checkbox
        checked={this.state.termsOfUse}
        onChange={this.handleCheck}
      />
      <Typography type="body1">{messages.terms}</Typography>
    </div>);
  }

  render() {
    const { classes, handleSubmit, handlePrev, last, first,
      children, reset, error, clearError } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        {React.Children.map(children, child =>
          React.cloneElement(child, { reset }),
        )}
        {last && <Grid item>
          {this.termsOfUse()}
        </Grid>
        }
        <Grid container direction="row" spacing={8} className={classes.buttonContainer}>
          <Grid item>
            <Button
              color="accent"
              raised
              disabled={last ? !this.state.termsOfUse : false}
              onTouchTap={handleSubmit}
            >
              {(last) ? messages.register : messages.continue}
            </Button>
          </Grid>
          <Grid item>
            {(!first && <Button
              onTouchTap={handlePrev}
            >
              {messages.cancel}
            </Button>)}
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={error}
          message={error}
          autoHideDuration={6e3}
          onClose={clearError}
        />
      </form >
    );
  }
}

RegistrationStep.propTypes = {
  classes: PropTypes.object.isRequired,
  /**
   * callback for 'next' button
   */
  handleSubmit: PropTypes.func.isRequired,
  /**
   * callback for 'back' button
   */
  handlePrev: PropTypes.func,
  /**
   * component to be wrapped
   */
  children: PropTypes.node,
  /**
   * whether step is the first, to control buttons appearance
   */
  first: PropTypes.bool,
  /**
   * whether step is the last, to control buttons appearance
   */
  last: PropTypes.bool,
  /**
   * callback for 'back' button
   */
  reset: PropTypes.func.isRequired,
  error: PropTypes.string,
  clearError: PropTypes.func,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  clearError: () => dispatch(clearSubmitErrors(ownProps.form)),
});

const connectedRegistrationStep = connect(
  null,
  mapDispatchToProps,
)(RegistrationStep);

export default withStyles(styleSheet)(reduxForm({
  form: 'registration',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(connectedRegistrationStep));
