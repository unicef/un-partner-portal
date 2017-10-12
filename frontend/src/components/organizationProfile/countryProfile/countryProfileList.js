import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import List, { ListSubheader } from 'material-ui/List';
import CountryProfileItem from './countryProfileItem';
import { selectCountryId } from '../../../reducers/countryProfiles';
import EoiCountryCell from '../../../components/eois/cells/eoiCountryCell';

const messages = {
  choose: 'Choose country',
};

const styleSheet = (theme) => {
  const padding = theme.spacing.unit * 2;
  return {
    root: {
      width: '100%',
      paddingTop: `${padding}px`,
      background: theme.palette.background.paper,
    },
    lineHeight: {
      lineHeight: '24px',
    },
  };
};

class CountryProfileList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedItems: [],
    };

    this.handleToggle = this.handleToggle.bind(this);
  }

  componentWillMount() {
    this.setState({ checkedItems: new Array(this.props.countries.length).fill(false) });
  }

  handleToggle(country) {
    const currentIndex = this.props.countries.indexOf(country);
    const list = new Array(this.props.countries.length).fill(false);
    list[currentIndex] = true;

    this.props.setSelectedCountryId(country.id);

    this.setState({
      checkedItems: list,
    });
  }

  render() {
    const { classes, countries } = this.props;

    return (
      <div className={classes.root}>
        <List>
          <ListSubheader classes={{ root: classes.lineHeight }}>{messages.choose}</ListSubheader>
          {countries.map(value =>
            (<CountryProfileItem
              key={value.id}
              country={value}
              handleToggle={this.handleToggle}
              selected={this.state.checkedItems[countries.indexOf(value)]}
            />),
          )}
        </List>
      </div>
    );
  }
}

CountryProfileList.propTypes = {
  classes: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired,
  setSelectedCountryId: PropTypes.func,
};

const mapDispatch = dispatch => ({
  setSelectedCountryId: countryId => dispatch(selectCountryId(countryId)),
});

const connectedCountryProfileList = connect(
  null,
  mapDispatch,
)(CountryProfileList);

export default withStyles(styleSheet, { name: 'CountryProfileList' })(connectedCountryProfileList);
