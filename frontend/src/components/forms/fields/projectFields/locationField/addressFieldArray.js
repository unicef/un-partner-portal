import R from 'ramda';
import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import TextFieldForm from '../../../../forms/textFieldForm';
import AddressMapField from './addressMapField';


const styleSheet = theme => ({
  innerPaper: {
    padding: theme.spacing.unit * 2,
    margin: `${theme.spacing.unit}px 0px ${theme.spacing.unit}px 0px`,
    backgroundColor: theme.palette.common.arrayFormInner,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.common.arrayFormOuter,
    padding: theme.spacing.unit * 2,
    width: '100%',
  },
});

const messages = {
  country: 'Country',
  location: 'Location of office(s)',
};

const LocationFieldArray = (props) => {
  const { classes, formName, readOnly, name, country } = props;
  
  return (
    <div className={classes.container}>
      <TextFieldForm
        label={messages.country}
        fieldName={'countryName'}
        optional
        textFieldProps={{
          InputProps: {
            inputProps: {
              initial: country,
            },
          },
        }}
        readOnly
      />
      <div className={classes.innerPaper}>
        <AddressMapField
          formName={formName}
          name={name}
          readOnly={readOnly}
        />
      </div>
    </div>);
};

LocationFieldArray.propTypes = {
  formName: PropTypes.string,
  name: PropTypes.string,
  country: PropTypes.string,
  readOnly: PropTypes.bool,
  classes: PropTypes.object,
};

const connected = connect(
  (state, ownProps) => {
    const partner = R.find(item => item.id === Number(ownProps.params.id), state.session.partners
      || state.agencyPartnersList.data.partners);
    const country = partner.is_hq ? messages.hqProfile : state.countries[partner.country_code];
    return {
      country,
    };
  },
)(LocationFieldArray);

export default withRouter(withStyles(styleSheet)(connected));

