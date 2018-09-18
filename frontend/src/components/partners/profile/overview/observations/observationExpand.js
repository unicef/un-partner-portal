import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Attachment from 'material-ui-icons/Attachment';
import GridColumn from '../../../../../components/common/grid/gridColumn';
import GridRow from '../../../../../components/common/grid/gridRow';
import ItemColumnCell from '../../../../common/cell/itemColumnCell';
import { fileNameFromUrl } from '../../../../../helpers/formHelper';
import { formatDateForPrint } from '../../../../../helpers/dates';
import { FLAGS } from '../../../../../helpers/constants';

const messages = {
  role: 'Role per Office',
  created: 'Created',
  comment: 'Comment',
  contact: 'Contact person (optional)',
  telephone: 'Telephone (optional)',
  email: 'E-mail',
  attachment: 'Attachment',
  reason: 'Reason for decision',
  reasonEscalation: 'Reason for deffering/escalation',
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

const displayAttachment = url =>
  (<div style={{ display: 'flex', alignItems: 'center' }}>
    {url && <Attachment style={{ marginRight: 5 }} />}
    <div
      type="subheading"
      role="button"
      tabIndex={0}
      onClick={() => { window.open(url); }}
      style={{
        cursor: 'pointer',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      }}
    >
      {fileNameFromUrl(url)}
    </div>
  </div>);

const ObservationExpand = (props) => {
  const { classes, observation } = props;

  return (
    <GridColumn spacing={8} className={classes.container}>
      <GridRow columns={2} spacing={8}>
        <ItemColumnCell label={messages.created} content={formatDateForPrint(R.path(['created'], observation))} />
        <ItemColumnCell label={messages.comment} content={R.path(['comment'], observation)} />
      </GridRow>
      {observation.category !== FLAGS.SANCTION && <GridRow columns={4} spacing={8}>
        <ItemColumnCell label={messages.contact} content={R.path(['contactPerson'], observation)} />
        <ItemColumnCell label={messages.telephone} content={R.path(['contactPhone'], observation)} />
        <ItemColumnCell label={messages.email} content={R.path(['contactEmail'], observation)} />
        <ItemColumnCell label={messages.attachment} object={displayAttachment(R.path(['attachment'], observation))} />
      </GridRow>}
      {observation.validationComment && <GridRow columns={1} spacing={8}>
        <ItemColumnCell label={messages.reason} content={R.path(['validationComment'], observation)} />
      </GridRow>}
      {observation.escalationComment && <GridRow columns={1} spacing={8}>
        <ItemColumnCell label={messages.reasonEscalation} content={R.path(['escalationComment'], observation)} />
      </GridRow>}
    </GridColumn>
  );
};

ObservationExpand.propTypes = {
  classes: PropTypes.object.isRequired,
  observation: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'ObservationExpand' })(ObservationExpand);
