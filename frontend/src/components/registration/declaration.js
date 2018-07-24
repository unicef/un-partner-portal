import React from 'react';
import { FieldArray } from 'redux-form';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import DeclarationRow from './declarationRow';


const messages = {
  header: 'By answering yes, the organization confirms the following:',
  questions: {
    ad_1: 'That it is a non-profit civil society organization.',
    ad_2: 'That it is committed to the core values of the UN and the Universal Declaration of Human Rights.',
    ad_3: ' That it abides by the Principles of Partnership as endorsed by the Global Humanitarian Platform (GHP) in July 2007. The Principles of Partnership are:\n ' +
    'a) Equality\n' +
    'b) Transparency\n' +
    'c) Result-orientated approach\n' +
    'd) Responsibility\n' +
    'e) Complementarity',
    ad_4: 'That it will not discriminate against any person or group on the basis of race, colour, sex, language, religion, political or other opinion, national or social origin, property, disability, birth, age or other status.',
    ad_5: 'That it shall ensure that all its employees, personnel and sub-contractors comply with the standards of conduct listed in Section 3 of the UN Secretary-General\'s Bulletin on "Special Measures for Protection from Sexual Exploitation and Abuse".',
    ad_6: 'That it has not been charged with or been complicit in fraud, or financial and non-financial corrupt activities, including money laundering, crimes against humanity and war crimes, and is not involved, nor has been involved in the past, with such activities that are incompatible with the UN mandate and values and that would render the organization unsuitable for dealing with UN agencies.',
    ad_7: 'That neither it nor any of its members is mentioned on the Consolidated United Nations Security Council Sanctions List. Furthermore, that it has not supported and does not support, directly or indirectly, individuals and entities sanctioned by or otherwise involved in a manner prohibited by a Security Council resolution adopted under Chapter VII of the Charter of the United Nations.',
    ad_8: 'That the information provided in the Partner Declaration above is accurate to the best of its knowledge, and that any misrepresentations, falsifications, or material omissions in the Partner Declaration, whenever discovered, may result in disqualification from or termination of partnership with the UN.',
  },
};

const styleSheet = theme => ({
  headerContainer: {
    marginTop: 10,
    borderBottom: `1px ${theme.palette.grey[300]} solid`,
    borderTop: `1px ${theme.palette.grey[300]} solid`,
  },
});

const renderQuestions = () => (
  <Grid item>
    {Object.keys(messages.questions).map((key, index) => (
      <DeclarationRow
        message={messages.questions[key]}
        index={index}
        key={index}
      />
    ))}
  </Grid>
);

const Declaration = (props) => {
  const { classes } = props;
  return (
    <Grid item xs={12}>
      <Grid container direction="column" spacing={16}>
        <Grid className={classes.headerContainer} item>
          <Typography type="body2">{messages.header}</Typography>
        </Grid>
        <FieldArray name="questions" component={renderQuestions} />
      </Grid>
    </Grid>
  );
};


Declaration.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'Declaration' })(Declaration);
