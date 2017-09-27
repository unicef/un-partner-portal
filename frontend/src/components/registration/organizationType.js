import React from 'react';
import PropTypes from 'prop-types';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import RadioForm from '../forms/radioForm';
import SelectForm from '../forms/selectForm';
import AlertDialog from '../common/alertDialog';

const messages = {
  header: 'This portal is not intended for private sector companies, ' +
  'goverment ministries or agencies and individuals. ',
  tooltip: 'Community Based Organization (CBO): A community-based ' +
  'organization is a grass-root association with small organizational' +
  ' and management structure, focused on improving the lives and ' +
  'well-being of a specific community, with local coverage or reach.\n' +
  'National NGO: A national NGO is a non-governmental organization ' +
  'that is established in only one country. National NGOs may have ' +
  'varying mandates, structures and systems depending on the country ' +
  'context and specific organization history, but are structured ' +
  'according to areas of common interest and concern by citizens.\n' +
  'International NGO: An international NGO is a non-governmental ' +
  'organization that has offices in more than one country. ' +
  'International NGOs are generally highly structured in terms of ' +
  'mandate, technical expertise and management systems, and are ' +
  'comprised of a headquarters office and varying networks of ' +
  'regional and/or country-based offices.\n' +
  'Intergovernmental / Multilateral / Bilateral Organization: ' +
  'An intergovernmental or multilateral organization is an ' +
  'organization formed pursuant to a multilateral act, such as a ' +
  'treaty, the membership of which is composed primarily of ' +
  'sovereign or member states or other intergovernmental ' +
  'organizations. A bilateral organization is a government agency ' +
  'that receives funding from the government in its home country, ' +
  'and uses the funding to aid developing countries. \n' +
  'Academic institution: An academic institution is an educational ' +
  'institution with degree-conferring authority that is dedicated to ' +
  'education and research.\n' +
  'Red Cross/Red Crescent Movement: The International Red Cross and ' +
  'Red Crescent Movement is an international humanitarian network ' +
  'composed of the International Committee of the Red Cross (ICRC), ' +
  'the International Federation of Red Cross and Red Crescent ' +
  'Societies (IFRC) and 190 member Red Cross and Red Crescent Societies.',
  alertDialog: 'You can not register your organization until a Headquarters ' +
            'profile is completed. Please contact your ' +
            'organization\'s HQ focal point to proceed',
  labels: {
    organizationType: 'Type of organization',
    office: 'Indicate if you are',
  },
  alertTitle: 'Warning',
};

const styleSheet = theme => ({
  info: {
    color: theme.palette.primary[500],
    background: theme.palette.primary[300],
    padding: '10px',
    fontSize: '0.8em',
    fontWeight: '300',
  },
  infoIcon: {
    fill: theme.palette.primary[500],
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  checkedRadio: {
    color: theme.palette.accent[500],
  },
});

const RADIO_VALUES = [
  {
    value: 'hq',
    label: 'Headquarters',
  },
  {
    value: 'country',
    label: 'Country Office',
  },
];

const MENU_VALUES = [
  {
    value: 'CBO',
    label: 'Community Based Organization (CBO)',
  },
  {
    value: 'NGO',
    label: 'National NGO',
  },
  {
    value: 'Int',
    label: 'International NGO (INGO)',
  },
  {
    value: 'Aca',
    label: 'Academic Institution',
  },
  {
    value: 'RCC',
    label: 'Red Cross/Red Crescent Movement',
  },
];


const OrganizationTypes = (props) => {
  const { classes, organization, office, reset } = props;
  return (
    <Grid item>
      <Grid item>
        <div className={classes.info}>
          <Typography color="inherit" >
            {messages.header}
            <a target="_blank" href="http://unicef.com" rel="noopener noreferrer">{messages.link}</a>
          </Typography>
        </div>
      </Grid>
      <SelectForm
        fieldName={'json.partner.display_type'}
        label={messages.labels.organizationType}
        values={MENU_VALUES}
        infoIcon
        infoText={messages.tooltip}
      />
      {(organization === 'Int' || organization === 'RCC') && (
        <RadioForm
          fieldName="office"
          label={messages.labels.office}
          values={RADIO_VALUES}
        />
      )}
      <AlertDialog
        trigger={office === 'country'}
        title={messages.alertTitle}
        text={messages.alertDialog}
        handleDialogClose={reset}
      />
    </Grid>
  );
};


OrganizationTypes.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
  /**
   * value picked for organization field to determine if office field should be
   * displayed
   */
  organization: PropTypes.string,
  /**
   * value picked for office field to determine if alert should be displayed
   */
  office: PropTypes.string,
  /**
   * function from redux form to reset form state
   */
  reset: PropTypes.func,
};

const selector = formValueSelector('registration');
const connectedOrganizationTypes = connect(
  state => ({
    office: selector(state, 'office'),
    organization: selector(state, 'json.partner.display_type'),
  }),
)(OrganizationTypes);

export default withStyles(styleSheet, { name: 'OrganizationTypes' })(connectedOrganizationTypes);
