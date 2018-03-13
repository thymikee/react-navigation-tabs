/* @flow */

import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import createTabNavigator from './createTabNavigator';

class BottomNavigationView extends React.Component {
  _getColor = ({ route }) => {
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    return options.tabBarColor;
  };

  render() {
    return <BottomNavigation {...this.props} getColor={this._getColor} />;
  }
}

export default createTabNavigator(BottomNavigationView);
