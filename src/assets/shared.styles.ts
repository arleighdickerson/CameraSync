import { StyleProp } from 'react-native';


export const container: StyleProp<any> = {
  alignItems:      'center',
  backgroundColor: '#fff',
  display:         'flex',
  flex:            1,
  height:          '100%',
  justifyContent:  'center',
};

export const input: StyleProp<any> = {
  containerStyle: {
    marginBottom: 10,
  },
  inputStyle: {
    height: 46,
  },
};
export const button: StyleProp<any> = {
  containerStyle: {
    paddingHorizontal: 10,
  },
};
