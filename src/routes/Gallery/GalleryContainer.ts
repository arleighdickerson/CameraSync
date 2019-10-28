import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import GalleryView, { GalleryViewProps } from './GalleryView';
import { RootState } from 'store/reducers';

const mapStateToProps = (state: RootState): GalleryViewProps => ({
  images: Object.values(state.mtp.images || {}),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  //
});

export default connect(mapStateToProps, mapDispatchToProps)(GalleryView);
