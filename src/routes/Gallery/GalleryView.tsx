import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import GalleryImage from './GalleryImage';
import { MtpObjectInfo } from 'modules/mtp/models';

import { FlatGrid } from 'react-native-super-grid';

export type GalleryViewProps = {
    images: MtpObjectInfo[],
    imageWidth?: number,
    imageHeight?: number,
    itemDimension?: number,
    onPress?: (objectHandle: number) => any
}

const styles = StyleSheet.create({
  gridView: {
    marginTop: 20,
    flex:      1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius:   5,
    padding:        10,
  },
});

// const WIDTH = Dimensions.get('window').width

const defaults = {
  imageWidth:    170,
  imageHeight:   170,
  itemDimension: 150,
  onPress:       () => null,
};

export default function GalleryView(props: GalleryViewProps) {
  const { images = [], imageWidth, imageHeight, itemDimension, onPress } = { ...defaults, ...props };
  return (
    <FlatGrid
      itemDimension={itemDimension}
      items={images}
      style={styles.gridView}
      renderItem={({ item, index }) => (
        <GalleryImage
          onPress={() => onPress(item.objectHandle)}
          index={index}
          key={index}
          uri={`data:image/jpg;base64,${item.thumbnail}`}
          width={imageWidth}
          height={imageHeight}
        />
      )}
    />
  );
}
