/* @flow */

import * as React from 'react';
import Expo from 'expo';
import { Text } from 'react-native';
import { createMaterialBottomTabNavigation } from 'react-navigation-tabs';
import { MaterialIcons } from '@expo/vector-icons';

const tabBarIcon = name => ({ tintColor }) => (
  <MaterialIcons
    style={{ backgroundColor: 'transparent' }}
    name={name}
    color={tintColor}
    size={24}
  />
);

class Home extends React.Component {
  static navigationOptions = {
    tabBarColor: '#3F51B5',
    tabBarIcon: tabBarIcon('photo-album'),
  };

  render() {
    return <Text>Home</Text>;
  }
}

class Test extends React.Component {
  static navigationOptions = {
    tabBarColor: '#009688',
    tabBarIcon: tabBarIcon('photo-library'),
  };

  render() {
    return <Text>Home</Text>;
  }
}

class Hey extends React.Component {
  static navigationOptions = {
    tabBarColor: '#795548',
    tabBarIcon: tabBarIcon('history'),
  };

  render() {
    return <Text>Home</Text>;
  }
}

class Whoa extends React.Component {
  static navigationOptions = {
    tabBarColor: '#607D8B',
    tabBarIcon: tabBarIcon('shopping-cart'),
  };

  render() {
    return <Text>Home</Text>;
  }
}

const App = createMaterialBottomTabNavigation(
  {
    Home,
    Test,
    Hey,
    Whoa,
  },
  {
    shifting: false,
    activeTintColor: '#F44336',
  }
);

Expo.registerRootComponent(App);
