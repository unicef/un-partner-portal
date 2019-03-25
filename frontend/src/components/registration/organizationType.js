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

import { selectNormalizedOrganizationTypes } from '../../store';

const messages = {
  header: 'The UN Partner Portal is solely intended for use by national NGOs, International Civil Society ' +
  'Organizations (International CSO), community based organizations, academic institutes, and Red Cross/Red ' +
  'Crescent National Society. The UN Partner Portal is NOT intended for use by private sector companies, government ' +
  'ministries, or individuals.',
  learn: ' Learn more.',
  tooltip: ['Community Based Organization (CBO): A community-based ' +
  'organization is a grass-root association with small organizational' +
  ' and management structure, focused on improving the lives and ' +
  'well-being of a specific community, with local coverage or reach.',
  'National NGO: A national NGO is a non-governmental organization ' +
  'that is established in only one country. National NGOs may have ' +
  'varying mandates, structures and systems depending on the country ' +
  'context and specific organization history, but are structured ' +
  'according to areas of common interest and concern by citizens.',
  'International CSOs are generally highly structured in terms of mandate,' +
  ' technical expertise and management systems, and are comprised of ' +
  'a headquarters office and varying networks of regional and/or ' +
  'country-based offices.',
  'Academic institution: An academic institution is an educational ' +
  'institution with degree-conferring authority that is dedicated to ' +
  'education and research.',
  'Red Cross/Red Crescent National Society: The International Red Cross and ' +
  'Red Crescent Movement is an international humanitarian network ' +
  'composed of the International Committee of the Red Cross (ICRC), ' +
  'the International Federation of Red Cross and Red Crescent ' +
  'Societies (IFRC) and 190 member Red Cross and Red Crescent Societies.'].join('\n\n'),
  alertDialog: 'Access to the UN Partner Portal for country (local) offices of international CSOs is granted by the offices’ headquarters, ' +
   'who must first register an account for the organization. Please liaise with your organization’s headquarters for access.',
  labels: {
    organizationType: 'Type of organization',
    office: 'Indicate if you are',
  },
  alertTitle: 'Notice',
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
    color: theme.palette.secondary[500],
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


const OrganizationTypes = (props) => {
  const { classes, organization, organizationTypes, office, reset } = props;
  return (
    <Grid container direction="column" spacing={24}>
      <Grid item>
        <div className={classes.info}>
          <Typography color="inherit" >
            {messages.header}
            <a target="_blank" href="http://unicef.com" rel="noopener noreferrer">{messages.learn}</a>
          </Typography>
        </div>
      </Grid>
      <SelectForm
        fieldName={'json.partner.display_type'}
        label={messages.labels.organizationType}
        values={organizationTypes}
        infoText={messages.tooltip}
      />
      {(organization === 'Int') && (
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
  /**
   * array of values for selection field
   */
  organizationTypes: PropTypes.array,
};

const selector = formValueSelector('registration');
const connectedOrganizationTypes = connect(
  state => ({
    office: selector(state, 'office'),
    organization: selector(state, 'json.partner.display_type'),
    organizationTypes: selectNormalizedOrganizationTypes(state),
  }),
)(OrganizationTypes);

export default withStyles(styleSheet, { name: 'OrganizationTypes' })(connectedOrganizationTypes);
