/* @flow */

import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import createTabNavigator from '../utils/createTabNavigator';

class BottomNavigationView extends React.Component {
  _getColor = ({ route }) => {
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    return options.tabBarColor;
  };

  render() {
    const { activeTintColor, navigation, ...rest } = this.props;

    return (
      <BottomNavigation
        {...rest}
        navigationState={navigation.state}
        getColor={this._getColor}
        theme={
          activeTintColor ? { colors: { primary: activeTintColor } } : null
        }
      />
    );
  }
}

export default createTabNavigator(BottomNavigationView);
