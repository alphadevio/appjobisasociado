import { RootSiblingParent } from 'react-native-root-siblings';
import React, {useEffect, useState} from 'react'
import "expo-router/entry";

export default function App() {
  
  return (
    <RootSiblingParent>
      <App />
    </RootSiblingParent>
  );
}