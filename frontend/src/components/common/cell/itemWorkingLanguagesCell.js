import React from 'react';
import R from 'ramda';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styleSheet = theme => ({
  label: {
    color: theme.palette.common.formLabel,
    paddingBottom: '5px',
  },
});

const ItemWorkingLanguagesCell = (props) => {
  const { label, content, workingLanguages, classes } = props;

  return (
    <div>
      <Typography type="caption" className={classes.label}>
        {label}
      </Typography>
      {!R.isEmpty(content)
        ? content.map(item => (
          workingLanguages[item] && R.indexOf(item, content) !== (content.length - 1)
            ? `${workingLanguages[item]}, `
            : workingLanguages[item]
        ))
        : '-'}
    </div>
  );
};

ItemWorkingLanguagesCell.propTypes = {
  classes: PropTypes.object,
  label: PropTypes.string.isRequired,
  content: PropTypes.string,
  workingLanguages: PropTypes.array,
};

const connected = connect(state => ({
  workingLanguages: state.partnerProfileConfig['working-languages'],
}))(ItemWorkingLanguagesCell);

export default withStyles(styleSheet, { name: 'ItemWorkingLanguagesCell' })(connected);
