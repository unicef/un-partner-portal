import Typography from 'material-ui/Typography';
import React from 'react';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import SpreadContent from '../../common/spreadContent';

const styleSheet = (theme) => {
  const padding = theme.spacing.unit;
  return {
    row: {
      display: 'flex',
      marginBottom: 'auto',
    },
    alignRight: {
      marginLeft: 'auto',
      flexBasis: '33%',
    },
    padding: {
      padding: `0 0 0 ${padding}px`,
    },
    paddingTopBottom: {
      padding: `${padding}px 0 ${padding}px 0`,
    },
    paddingTop: {
      padding: `${padding}px 0 0 0`,
    },
  };
};

const ItemRowCellDivider = (props) => {
  const { label, content, divider, labelSecondary, classes } = props;
  return (
    <div>
      <SpreadContent>
        <Typography color={labelSecondary ? 'secondary' : 'inherit'} type="body1" >{label}</Typography>
        <div className={classes.alignRight}>
          { Array.isArray(content)
            ? content.map((item, index) => (<Typography key={index} type="body1">{item}</Typography>))
            : (content != undefined && <Typography type="body1" >{content}</Typography>)
          }
        </div>
      </SpreadContent>
      {!divider
        ? <div className={classes.paddingTopBottom}>
          <Divider />
        </div>
        : <div className={classes.paddingTop} />}
    </div>
  );
};

ItemRowCellDivider.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  labelSecondary: PropTypes.bool,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
  divider: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'ItemRowCellDivider' })(ItemRowCellDivider);
