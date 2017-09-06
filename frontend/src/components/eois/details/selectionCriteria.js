import React from 'react';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import GridColumn from '../../common/grid/gridColumn';
import HeaderList from '../../common/list/headerList';
import PaddedContent from '../../common/paddedContent';

const messages = {
  title: 'Selection Criteria',
};

const title = () => (
  <Typography type="subheading" >{messages.title}</Typography>
);

const renderRow = criterias => criterias.map(selection => (
  <PaddedContent>
    <Typography type="SubHeading">{selection.display_type}</Typography>
    <Typography>{selection.description} </Typography>
  </PaddedContent>
));

const SelectionCriteria = (props) => {
  const { selectionCriterias } = props;
  return (
    <HeaderList
      header={title}
      rows={renderRow(selectionCriterias)}
    />
  );
};

const mapStateToProps = (state, ownProps) => ({
  selectionCriterias: state.cfeiDetails[ownProps.id].assessment_criterias,
});

export default connect(
  mapStateToProps,
)(SelectionCriteria);
