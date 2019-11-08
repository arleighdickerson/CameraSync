import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import GalleryView, { GalleryViewProps } from './GalleryView';
import { RootState } from 'store/reducers';
import { getImages } from 'modules/mtp/selectors';

const mapStateToProps = (state: RootState): GalleryViewProps => ({
  images: getImages(state),
});


const mapDispatchToProps = (dispatch: Dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(GalleryView);
