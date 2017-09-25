import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Delete from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';
import SpreadContent from '../../../common/spreadContent';
import HeaderList from '../../../common/list/headerList';
import ConceptNoteSubmission from './conceptNoteSubmission';
import { deleteCn } from '../../../../reducers/conceptNote';

const messages = {
  title: 'Concept Note',
};


class CfeiSubmission extends Component {
  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  onDelete() {
    
    this.props.deleteCn();
  }

  titleHeader(cnUploaded) {
    return (
      <SpreadContent>
        <Typography type="headline">{messages.title}</Typography>
        {cnUploaded && <IconButton onClick={() => this.onDelete()}><Delete /></IconButton>}
      </SpreadContent>
    );
  }

  render() {
    const { partnerId, cnUploaded } = this.props;

    return (
      <HeaderList
        header={this.titleHeader(cnUploaded)}
        rows={[<ConceptNoteSubmission />]}
      />
    );
  }
}

CfeiSubmission.propTypes = {
  partnerId: PropTypes.string,
  cnUploaded: PropTypes.object,
  deleteCn: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  partnerId: ownProps.params.id,
  loader: state.conceptNote.loading,
  cnUploaded: state.conceptNote.cnFile,
});

const mapDispatch = dispatch => ({
  deleteCn: () => dispatch(deleteCn()),
});

const connectedCfeiSubmission = connect(mapStateToProps, mapDispatch)(CfeiSubmission);
export default withRouter(connectedCfeiSubmission);

