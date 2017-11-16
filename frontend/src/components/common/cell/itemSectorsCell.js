import React from 'react';
import R from 'ramda';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { groupSpecializationsByCategory } from '../../../reducers/partnerProfileDetails';

const styleSheet = theme => ({
  label: {
    color: theme.palette.common.formLabel,
    paddingBottom: '5px',
  },
  color: {
    color: theme.palette.common.formLabel,
  },
  padding: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '5px',
  },
});

const SectorWithSpec = (classes, sectors, specializations, item) => {
  if (sectors[item.sector]) {
    return (
      <div className={classes.padding}>
        <div className={classes.color}>
          {sectors[item.sector]}
        </div>
        {<div>&nbsp;</div>}
        <div>
          {item.areas.map(area => (
            specializations[area] && R.indexOf(area, item.areas) !== (item.areas.length - 1)
              ? `${specializations[area]}, `
              : specializations[area]
          ))}
        </div>
      </div>
    );
  }

  return '-';
};

const ItemWorkingLanguagesCell = (props) => {
  const { label, content, sectors, specializations, classes } = props;

  const normalized = groupSpecializationsByCategory(content);

  return (
    <div>
      <Typography type="caption" className={classes.label}>
        {label}
      </Typography>
      {normalized.length > 0
        ? normalized.map(item => (
          SectorWithSpec(classes, sectors, specializations, item)
        ))
        : '-'}
    </div>
  );
};

ItemWorkingLanguagesCell.propTypes = {
  classes: PropTypes.object,
  label: PropTypes.string.isRequired,
  content: PropTypes.string,
  sectors: PropTypes.array,
  specializations: PropTypes.array,
};

const connected = connect(state => ({
  sectors: state.sectors.allSectors,
  specializations: state.sectors.allSpecializations,
}))(ItemWorkingLanguagesCell);

export default withStyles(styleSheet, { name: 'ItemWorkingLanguagesCell' })(connected);
