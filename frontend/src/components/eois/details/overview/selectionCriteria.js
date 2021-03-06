import React from 'react';
import R from 'ramda';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../common/list/headerList';
import PaddedContent from '../../../common/paddedContent';
import { selectCfeiDetails } from '../../../../store';

const messages = {
  title: 'Selection Criteria',
  weight: 'Weight of criteria',
};

const title = () => (
  <Typography style={{ margin: 'auto 0' }} type="headline" >{messages.title}</Typography>
);

const renderRow = (criterias, allCriteria) => criterias.map(selection => (<PaddedContent key={selection.selection_criteria}>
  <Typography type="subheading">{allCriteria[selection.selection_criteria]}</Typography>
  <Typography type="caption">{selection.description} </Typography>
  {selection.weight && <Typography
    type="caption"
  >
    {`${messages.weight}: ${selection.weight}`}
  </Typography>}
</PaddedContent>));

const SelectionCriteria = (props) => {
  const { selectionCriteria, allCriteria } = props;
  return (
    <HeaderList
      header={title}
    >
      {renderRow(selectionCriteria, allCriteria)}
    </HeaderList>
  );
};

SelectionCriteria.propTypes = {
  selectionCriteria: PropTypes.array,
  allCriteria: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);
  return {
    selectionCriteria: R.path(['assessments_criteria'], cfei) || [],
    allCriteria: state.selectionCriteria,
  };
};

export default connect(
  mapStateToProps,
)(SelectionCriteria);
