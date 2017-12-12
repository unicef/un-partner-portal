import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';
import Typography from 'material-ui/Typography';
import PaddedContent from '../../../../../common/paddedContent';
import EmptyContent from '../../../../../common/emptyContent';
import HeaderList from '../../../../../common/list/headerList';
import { isUserAFocalPoint, selectCfeiAwardedPartners } from '../../../../../../store';
import { loadAwardedPartners } from '../../../../../../reducers/cfeiAwardedPartners';
import SingleAward from './singleAward';

const messages = {
  title: 'Selected Partner(s)',
  empty: 'No results yet',
};

class AwardedPartners extends Component {
  componentWillMount() {
    this.props.getAwardedPartners();
  }

  content() {
    const { loading, awardedPartners, focalPoint } = this.props;
    if (loading) {
      return <EmptyContent />;
    } else if (!awardedPartners || isEmpty(awardedPartners)) {
      return (<PaddedContent>
        <Typography>
          {messages.empty}
        </Typography>
      </PaddedContent>);
    }
    return (
      <div>
        {awardedPartners.map(award =>
          <SingleAward award={award} isFocalPoint={focalPoint} />)}
      </div>);
  }


  render() {
    const { loading } = this.props;
    return (
      <HeaderList
        loading={loading}
        header={<Typography type="headline" >{messages.title}</Typography>}
      >
        {this.content()}
      </HeaderList>
    );
  }
}

AwardedPartners.propTypes = {
  awardedPartners: PropTypes.array,
  loading: PropTypes.bool,
  getAwardedPartners: PropTypes.func,
  focalPoint: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  focalPoint: isUserAFocalPoint(state, ownProps.id),
  loading: state.cfeiAwardedPartners.status.loading,
  awardedPartners: selectCfeiAwardedPartners(state, ownProps.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getAwardedPartners: () => dispatch(loadAwardedPartners(ownProps.id)),
});


export default connect(mapStateToProps, mapDispatchToProps)(AwardedPartners);
