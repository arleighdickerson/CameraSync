import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Image,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';

const WIDTH = Dimensions.get('window').width;

export type GalleryImageProps = {
    uri: string,
    index: number,
    onPress?: (event: GestureResponderEvent) => void
}

export default class GalleryImage extends Component<GalleryImageProps> {
  render() {
    const { uri, onPress } = this.props;
    return (
      <View style={{
        backgroundColor: 'transparent',
        borderRadius:    0,
        height:          80,
        width:           WIDTH / 3,
      }}>
        <TouchableOpacity onPress={onPress}>
          <Image
            source={{ uri }}
            style={{
              height:     80,
              left:       0,
              position:   'absolute',
              resizeMode: 'cover',
              top:        0,
              width:      WIDTH / 3,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
