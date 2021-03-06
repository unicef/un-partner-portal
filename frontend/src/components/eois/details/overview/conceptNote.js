import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../common/list/headerList';
import FileDownloadButton from '../../../common/buttons/fileDownloadButton';
import { formatDateForPrint } from '../../../../helpers/dates';
import Loader from '../../../common/loader';
import PaddedContent from '../../../common/paddedContent';
import EmptyContent from '../../../common/emptyContent';
import GridColumn from '../../../common/grid/gridColumn';

const messages = {
  caption: 'Submission Date',
};

const ConceptNote = (props) => {
  const { conceptNote, date, title, loading } = props;
  return (
    <HeaderList
      header={<Typography style={{ margin: 'auto 0' }} type="headline" >{title}</Typography>}
    >
      <PaddedContent>
        <Loader loading={loading}>
          {!loading ? (<GridColumn alignItems="center">
            <FileDownloadButton fileUrl={conceptNote} />
            {date && <Typography type="caption">
              {`${messages.caption}: ${formatDateForPrint(date)}`}
            </Typography>}
          </GridColumn>) : <EmptyContent />}
        </Loader>
      </PaddedContent>
    </HeaderList>
  );
};

ConceptNote.propTypes = {
  conceptNote: PropTypes.string,
  date: PropTypes.string,
  title: PropTypes.string,
  loading: PropTypes.bool,
};

export default ConceptNote;

