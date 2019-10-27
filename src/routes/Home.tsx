import React from 'react';
import CameraRoll from '@react-native-community/cameraroll';
import { Text, View, ScrollView, Image, Button } from 'react-native';

export default class Home extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { photos: [] };
  }

    _handleButtonPress = () => {
      CameraRoll.getPhotos({
        first:     20,
        assetType: 'Photos',
      })
        .then(r => {
          console.log(r);
          this.setState({ photos: r.edges });
        })
        .catch((err) => {
          console.error(err);
          //Error Loading Images
        });
    };

    render() {
      return (
        <View>
          <Button title="Load Images" onPress={this._handleButtonPress}/>
          <ScrollView>
            {this.state.photos.map((p: any, i: any) => {
              return (
                <Image
                  key={i}
                  style={{
                    width:  300,
                    height: 100,
                  }}
                  source={{ uri: p.node.image.uri }}
                />
              );
            })}
          </ScrollView>
        </View>
      );
    }
}

/*
import { Text, View } from 'react-native';
import * as styles from 'assets/shared.styles';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  );
}
 */
