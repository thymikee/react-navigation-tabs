/* @flow */

import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  route: any,
  focused: any,
  activeTintColor: any,
  inactiveTintColor: any,
  renderIcon: any,
  style: any,
};

export default class TabBarIcon extends React.Component<Props> {
  render() {
    const {
      route,
      focused,
      activeTintColor,
      inactiveTintColor,
      renderIcon,
      style,
    } = this.props;

    const activeOpacity = focused ? 1 : 0;
    const inactiveOpacity = focused ? 0 : 1;

    // We render the icon twice at the same position on top of each other:
    // active and inactive one, so we can fade between them.
    return (
      <View style={style}>
        <View style={[styles.icon, { opacity: activeOpacity }]}>
          {renderIcon({
            route,
            focused: true,
            tintColor: activeTintColor,
          })}
        </View>
        <View style={[styles.icon, { opacity: inactiveOpacity }]}>
          {renderIcon({
            route,
            focused: false,
            tintColor: inactiveTintColor,
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    // We render the icon twice at the same position on top of each other:
    // active and inactive one, so we can fade between them:
    // Cover the whole iconContainer:
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
});
