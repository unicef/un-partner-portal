import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ItemColumnCell from '../../components/common/cell/itemColumnCell';
import GridColumn from '../../components/common/grid/gridColumn';
import GridRow from '../../components/common/grid/gridRow';
import ItemWorkingLanguagesCell from '../../components/common/cell/itemWorkingLanguagesCell';
import ItemSectorsCell from '../../components/common/cell/itemSectorsCell';
import PaddedContent from '../../components/common/paddedContent';

const messages = {
  role: 'Role per Office',
};

const styleSheet = (theme) => {
  const padding = theme.spacing.unit;
  const paddingSmall = theme.spacing.unit * 2;
  const paddingMedium = theme.spacing.unit * 4;
  return {
    alignCenter: {
      display: 'flex',
      alignItems: 'center',
    },
    alignText: {
      textAlign: 'center',
    },
    row: {
      display: 'flex',
    },
    padding: {
      padding: `0 0 0 ${padding}px`,
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
      padding: `${paddingSmall}px 0 ${paddingSmall}px ${paddingMedium}px`,
    },
  };
};

const UserDetailsExpand = (props) => {
  const { classes, partner } = props;

  if (partner) {
    return (
      <GridColumn className={classes.container}>
        <GridRow columns={1} spacing={24}>
          <ItemSectorsCell label={messages.specialisation} content={partner.experiences} />
        </GridRow>
      </GridColumn>
    );
  }

  return (<PaddedContent big>
    <div className={classes.alignText}>{messages.no_data}</div>
  </PaddedContent>);
};

UserDetailsExpand.propTypes = {
  classes: PropTypes.object.isRequired,
  partner: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'UserDetailsExpand' })(UserDetailsExpand);
