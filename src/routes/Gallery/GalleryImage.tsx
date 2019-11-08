import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';

// const WIDTH = Dimensions.get('window').width;

export type GalleryImageProps = {
    uri: string,
    index: number,
    onPress?: (event: GestureResponderEvent) => void,
    width: number,
    height: number
}
// @todo why is onPress not working? try using a class Component instead of Functional
export default function GalleryImage(props: GalleryImageProps) {
  const { uri, onPress, height, width } = props;
  return (
    <View style={{
      backgroundColor: 'transparent',
      borderRadius:    0,
      height,
      width,
    }}>
      <TouchableOpacity onPress={onPress}>
        <Image
          source={{ uri }}
          style={{
            left:       0,
            position:   'absolute',
            resizeMode: 'cover',
            top:        0,
            height,
            width,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
