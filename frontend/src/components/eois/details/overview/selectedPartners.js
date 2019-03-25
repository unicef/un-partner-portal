import React from 'react';
import R from 'ramda';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../common/list/headerList';
import PaddedContent from '../../../common/paddedContent';
import { selectCfeiDetails } from '../../../../store';

const messages = {
  title: 'Winner(s)',
};

const title = () => (
  <Typography style={{ margin: 'auto 0' }} type="headline" >{messages.title}</Typography>
);

const renderRow = partners => partners.map(({ id, legal_name }) => (
  <PaddedContent key={id}>
    <Typography type="subheading">{legal_name}</Typography>
  </PaddedContent>));

const SelectedPartners = (props) => {
  const { partners } = props;

  return (
    <HeaderList
      header={title}
    >
      {renderRow(partners)}
    </HeaderList>
  );
};

SelectedPartners.propTypes = {
  partners: PropTypes.array,
};

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);

  return {
    partners: R.path(['winning_partners'], cfei) || [],
  };
};

export default connect(
  mapStateToProps,
)(SelectedPartners);
