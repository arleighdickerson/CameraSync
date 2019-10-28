import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import GalleryImage from './GalleryImage';
import { MtpObjectInfo } from 'modules/mtp/models';

// import { Col, Row, Grid } from "react-native-easy-grid";
// import { SectionGrid } from 'react-native-super-grid';

export type GalleryViewProps = {
    images: MtpObjectInfo[]
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    flexWrap:      'wrap',
  },
});

export default function GalleryView(props: GalleryViewProps) {
  const { images = [] } = props;

  const children = images.map((image, idx) => (
    <GalleryImage
      index={idx}
      key={idx}
      uri={`data:image/jpg;base64,${image.thumbnail}`}
    />
  ));

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      {children}
    </ScrollView>
  );
}
