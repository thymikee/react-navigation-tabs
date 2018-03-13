/* @flow */

import * as React from 'react';
import {
  TabRouter,
  createNavigator,
  createNavigationContainer,
} from 'react-navigation';
import SceneView from './SceneView';

export default function createTabNavigator(TabView: React.ComponentType<*>) {
  class NavigationView extends React.Component<*> {
    _renderScene = ({ route }) => {
      const { screenProps, descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const TabComponent = descriptor.getComponent();
      return (
        <SceneView
          screenProps={screenProps}
          navigation={descriptor.navigation}
          component={TabComponent}
        />
      );
    };

    _renderIcon = ({ route, focused, tintColor }) => {
      const { descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const options = descriptor.options;

      if (options.tabBarIcon) {
        return typeof options.tabBarIcon === 'function'
          ? options.tabBarIcon({ focused, tintColor })
          : options.tabBarIcon;
      }

      return null;
    };

    _getLabelText = ({ route }) => {
      const { descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const options = descriptor.options;

      if (options.tabBarLabel) {
        return options.tabBarLabel;
      }

      if (typeof options.title === 'string') {
        return options.title;
      }

      return route.routeName;
    };

    _handleIndexChange = index => {
      const { navigation } = this.props;
      navigation.navigate(navigation.state.routes[index].routeName);
    };

    render() {
      const { state } = this.props.navigation;
      const route = state.routes[state.index];
      const { descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const options = {
        ...this.props.navigationConfig,
        ...descriptor.options,
      };

      return (
        <TabView
          {...options}
          getLabelText={this._getLabelText}
          renderIcon={this._renderIcon}
          renderScene={this._renderScene}
          onIndexChange={this._handleIndexChange}
          navigationState={state}
          descriptors={descriptors}
        />
      );
    }
  }

  return (routes, config = {}) => {
    const router = TabRouter(routes, config);
    const navigator = createNavigator(NavigationView, router, config);

    return createNavigationContainer(navigator);
  };
}
