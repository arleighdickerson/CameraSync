import { createSelector } from 'reselect';
import { RootState } from 'store/reducers';
import { Images } from 'modules/mtp/reducer';
import { MtpObjectInfo } from 'modules/mtp/models';

const getImageMap = (state: RootState) => state.mtp.images || {};

export const getImages = createSelector(
  [getImageMap],
  (imageMap: Images) => {
    const images: MtpObjectInfo[] = Object.values(imageMap);

    images.sort((v0, v1) => v1.dateModified - v0.dateModified);

    return images;
  }
);
