import React, { Component } from 'react';
import { View } from 'react-native';
import GalleryImage from './GalleryImage';
import { MtpObjectInfo } from 'modules/mtp/models';

export type GalleryViewProps = {
    images: MtpObjectInfo[]
}

type GalleryViewState = {
    shown: boolean,
    index: number
}

export default class GalleryView extends Component<GalleryViewProps, GalleryViewState> {
    readonly showLightbox: (index: number) => any
    readonly hideLightbox: () => any

    constructor(props: GalleryViewProps) {
      super(props);
      this.showLightbox = (index) => {
        this.setState({
          index,
          shown: true,
        });
      };
      this.hideLightbox = () => {
        this.setState({
          index: 0,
          shown: false,
        });
      };
    }

    state = {
      index: 0,
      shown: false,
    };

    render() {
      const { images } = this.props;
      const { index, shown } = this.state;
      return (
        <View
          style={{
            flexDirection: 'row',
            flexWrap:      'wrap',
          }}
        >
          {images.map((image, idx) => (
            <GalleryImage
              index={idx}
              key={idx}
              onPress={this.showLightbox}
              uri={`data:image/jpg;base64,${image.thumbnail}`}
            />
          ))}

          {/*
           <ImageViewer
              shown={shown}
              imageUrls={images}
              onClose={this.hideLightbox}
              index={index}
            />
            */}

        </View>
      );
    }
}
