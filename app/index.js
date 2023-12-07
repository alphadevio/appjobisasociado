import { StyleSheet, View} from 'react-native';
import React, {useEffect, useState, useContext} from 'react'
import { StatusBar } from 'expo-status-bar';
import Login from './login';
import { RootSiblingParent } from 'react-native-root-siblings';
import { colors } from '../shared/config/themes';
import { ThemeContext } from '../shared/config/themeContext';


export default function Page() {

  return (
    <RootSiblingParent>
      <View style={styles.container}>
        <StatusBar
          animated={false}
          backgroundColor={'#222222'}
          style="light"
        />
        <Login/>
      </View>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
