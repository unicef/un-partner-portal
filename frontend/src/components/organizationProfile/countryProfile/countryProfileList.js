import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import List, { ListSubheader } from 'material-ui/List';
import CountryProfileItem from './countryProfileItem';

const messages = {
  choose: 'Choose country',
};

const styleSheet = createStyleSheet('CountryProfileList', (theme) => {
  const padding = theme.spacing.unit * 2;
  return {
    root: {
      width: '100%',
      paddingTop: `${padding}px`,
      background: theme.palette.background.paper,
    },
    default: {
      userSelect: 'none',
      padding: 0,
    },
    checked: {
      color: theme.palette.accent[500],
    },
    disabled: {
      color: theme.palette.accent[200],
    },
    lineHeight: {
      lineHeight: '24px',
    },
  };
});

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

    this.setState({
      checkedItems: list,
    });
  }

  render() {
    const { classes, countries } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.info}>
          {messages.info}
        </div>
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
};

export default withStyles(styleSheet)(CountryProfileList);
