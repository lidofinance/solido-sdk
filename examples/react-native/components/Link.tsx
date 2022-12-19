import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {Text} from 'react-native-paper';

const Link = ({href, ...props}) => {
  const onPress = useCallback(() => {
    void Linking.openURL(href);
  }, [href]);

  return (
    <Text
      {...props}
      style={{color: 'blue', padding: 6, margin: 4}}
      onPress={onPress}
    />
  );
};

export default Link;
