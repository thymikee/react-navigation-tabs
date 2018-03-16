/* @flow */

import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import createTabNavigator from '../utils/createTabNavigator';

type Props = {
  onIndexChange: (index: number) => mixed,
  getLabelText: (props: { route: any }) => string,
  renderIcon: (props: { route: any, tintColor: string }) => React.Node,
  renderScene: (props: { route: any }) => React.Node,
  onTabPress: (props: { route: any }) => React.Node,
  navigation: any,
  descriptors: any,
  activeTintColor?: string,
};

class BottomNavigationView extends React.Component<Props> {
  _getColor = ({ route }) => {
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    return options.tabBarColor;
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { activeTintColor, navigation, descriptors, ...rest } = this.props;

    return (
      <BottomNavigation
        {...rest}
        navigationState={navigation.state}
        getColor={this._getColor}
        theme={
          /* $FlowFixMe */
          activeTintColor ? { colors: { primary: activeTintColor } } : null
        }
      />
    );
  }
}

export default createTabNavigator(BottomNavigationView);
