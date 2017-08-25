import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import Add from 'material-ui-icons/Add';
import Button from 'material-ui/Button';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import CountryProfileItem from './countryProfileItem';

const messages = {
  countryProfile: 'Country Profiles',
  user: 'user',
  new: 'new',
  lastUpdate: 'Last update: ',
  pluralSuffix: 's',
};

const countryItemsMockData = [
  { country: 'Kenya', users: 25, update: '01 Jan 2016', completed: true },
  { country: 'Syria', users: 1, update: '03 Jan 2017', completed: false },
  { country: 'Ukraine', users: 2, update: '01 Aug 2016', completed: false },
  { country: 'Poland', users: 105, update: '01 Aug 2017', completed: true },
];

const styleSheet = createStyleSheet('sidebarMenu', (theme) => {
  const paddingSmall = theme.spacing.unit * 2;
  const paddingMedium = theme.spacing.unit * 3;
  return {
    center: {
      textAlign: 'center',
    },
    alignCenter: {
      display: 'flex',
      alignItems: 'center',
    },
    alignRight: {
      display: 'flex',
      alignItems: 'right',
    },
    title: {
      fontSize: '15px',
    },
    right: {
      textAlign: 'right',
    },
    icon: {
      fill: theme.palette.primary[300],
      marginRight: 3,
      width: 20,
      height: 20,
    },
    container: {
      width: '100%',
      margin: '0',
      backgroundColor: theme.palette.primary[100],
      padding: `${paddingMedium}px ${paddingSmall}px ${paddingMedium}px ${paddingMedium}px`,
    },
  };
});

const renderCountryItems = countryItemsMockData.map(item =>
  (<Grid item ><Divider />
    <CountryProfileItem
      country={item.country}
      users={item.users}
      update={item.update}
      completed={item.completed}
    /></Grid>));

class CountryOfficesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  render() {
    const { classes, header, children } = this.props;
    return (
      <Paper>
        <Grid align="center" className={classes.container} container>
          <Grid xs={10} item>
            <div className={classes.title}>
              <Typography type="title" color="inherit">{messages.countryProfile}</Typography>
            </div>
          </Grid>
          <Grid className={classes.right} xs={2} item>
            <Button
              color="accent"
              raised
            >
              <div className={classes.alignCenter}>
                <Add className={classes.icon} />
                {messages.new}
              </div>
            </Button>
          </Grid>
        </Grid>
        {renderCountryItems}
      </Paper>
    );
  }
}

CountryOfficesList.propTypes = {
  classes: PropTypes.object.isRequired,
  header: PropTypes.element.isRequired,
  children: PropTypes.node.isRequired,
};

export default withStyles(styleSheet)(CountryOfficesList);
