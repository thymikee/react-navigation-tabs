/* @flow */
import React from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { NavigationActions } from 'react-navigation';

import TabBarIcon from './TabBarIcon';
import withOrientation from '../utils/withOrientation';

type Props = {
  navigation: any,
  descriptors: any,
  onIndexChange: any,
  getOnPress: any,
  activeTintColor: any,
  inactiveTintColor: any,
  activeBackgroundColor: any,
  inactiveBackgroundColor: any,
  allowFontScaling: boolean,
  renderIcon: any,
  showLabel: boolean,
  showIcon: boolean,
  labelStyle: any,
  tabStyle: any,
  style: any,
  isLandscape: boolean,
};

const majorVersion = parseInt(Platform.Version, 10);
const isIos = Platform.OS === 'ios';
const isIOS11 = majorVersion >= 11 && isIos;
const defaultMaxTabBarItemWidth = 125;

class TabBarBottom extends React.Component<Props> {
  // See https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/UIKitUICatalog/UITabBar.html
  static defaultProps = {
    activeTintColor: '#3478f6', // Default active tint color in iOS 10
    activeBackgroundColor: 'transparent',
    inactiveTintColor: '#929292', // Default inactive tint color in iOS 10
    inactiveBackgroundColor: 'transparent',
    showLabel: true,
    showIcon: true,
    allowFontScaling: true,
    adaptive: isIOS11,
  };

  _renderLabel = ({ route, focused }) => {
    const {
      descriptors,
      activeTintColor,
      inactiveTintColor,
      labelStyle,
      showLabel,
      showIcon,
      allowFontScaling,
    } = this.props;

    if (showLabel === false) {
      return null;
    }

    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    const tintColor = focused ? activeTintColor : inactiveTintColor;
    const label = this.props.getLabel({ route, focused, tintColor });

    if (typeof label === 'string') {
      return (
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.label,
            { color: tintColor },
            showIcon && this._shouldUseHorizontalTabs()
              ? styles.labelBeside
              : styles.labelBeneath,
            labelStyle,
          ]}
          allowFontScaling={allowFontScaling}
        >
          {label}
        </Animated.Text>
      );
    }

    if (typeof label === 'function') {
      return label({ route, focused, tintColor });
    }

    return label;
  };

  _renderIcon = ({ route, focused }) => {
    const {
      navigation,
      activeTintColor,
      inactiveTintColor,
      renderIcon,
      showIcon,
      showLabel,
    } = this.props;
    if (showIcon === false) {
      return null;
    }

    const horizontal = this._shouldUseHorizontalTabs();

    return (
      <TabBarIcon
        route={route}
        focused={focused}
        navigation={navigation}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        renderIcon={renderIcon}
        style={[
          styles.iconWithExplicitHeight,
          showLabel === false && !horizontal && styles.iconWithoutLabel,
          showLabel !== false && !horizontal && styles.iconWithLabel,
        ]}
      />
    );
  };

  _tabItemMaxWidth() {
    const { tabStyle, layout } = this.props;
    let maxTabBarItemWidth;

    const flattenedTabStyle = StyleSheet.flatten(tabStyle);

    if (flattenedTabStyle) {
      if (typeof flattenedTabStyle.width === 'number') {
        maxTabBarItemWidth = flattenedTabStyle.width;
      } else if (
        typeof flattenedTabStyle.width === 'string' &&
        flattenedTabStyle.endsWith('%')
      ) {
        const width = parseFloat(flattenedTabStyle.width);
        if (Number.isFinite(width)) {
          maxTabBarItemWidth = layout.width * (width / 100);
        }
      } else if (typeof flattenedTabStyle.maxWidth === 'number') {
        maxTabBarItemWidth = flattenedTabStyle.maxWidth;
      } else if (
        typeof flattenedTabStyle.maxWidth === 'string' &&
        flattenedTabStyle.endsWith('%')
      ) {
        const width = parseFloat(flattenedTabStyle.maxWidth);
        if (Number.isFinite(width)) {
          maxTabBarItemWidth = layout.width * (width / 100);
        }
      }
    }

    if (!maxTabBarItemWidth) {
      maxTabBarItemWidth = defaultMaxTabBarItemWidth;
    }

    return maxTabBarItemWidth;
  }

  _shouldUseHorizontalTabs() {
    const { routes } = this.props.navigation.state;
    const { isLandscape, layout, adaptive } = this.props;

    if (!adaptive) {
      return false;
    }

    let tabBarWidth = layout.width;
    if (tabBarWidth === 0) {
      return Platform.isPad;
    }

    if (!Platform.isPad) {
      return isLandscape;
    } else {
      const maxTabBarItemWidth = this._tabItemMaxWidth();
      return routes.length * maxTabBarItemWidth <= tabBarWidth;
    }
  }

  _handleTabPress = index => {
    const { onIndexChange, navigation } = this.props;
    const currentIndex = navigation.state.index;

    if (currentIndex === index) {
      let childRoute = navigation.state.routes[index];
      if (childRoute.hasOwnProperty('index') && childRoute.index > 0) {
        navigation.dispatch(
          NavigationActions.popToTop({ key: childRoute.key })
        );
      } else {
        // TODO: do something to scroll to top
      }
    } else {
      onIndexChange(index);
    }
  };

  render() {
    const {
      navigation,
      descriptors,
      getOnPress,
      activeBackgroundColor,
      inactiveBackgroundColor,
      style,
      tabStyle,
    } = this.props;

    const { routes } = navigation.state;
    const previousScene = routes[navigation.state.index];

    const tabBarStyle = [
      styles.tabBar,
      this._shouldUseHorizontalTabs() && !Platform.isPad
        ? styles.tabBarCompact
        : styles.tabBarRegular,
      style,
    ];

    return (
      <Animated.View style={tabBarStyle}>
        <SafeAreaView
          style={styles.container}
          forceInset={{ bottom: 'always', top: 'never' }}
        >
          {routes.map((route, index) => {
            const focused = index === navigation.state.index;
            const scene = { route, index, focused };
            const onPress = getOnPress(previousScene, scene);
            const descriptor = descriptors[route.key];

            const backgroundColor = focused
              ? activeBackgroundColor
              : inactiveBackgroundColor;

            return (
              <TouchableWithoutFeedback
                key={route.key}
                onPress={() =>
                  onPress
                    ? onPress({
                        navigation: descriptor.navigation,
                        defaultHandler: () => this._handleTabPress(index),
                      })
                    : this._handleTabPress(index)
                }
              >
                <View
                  style={[
                    styles.tab,
                    { backgroundColor },
                    this._shouldUseHorizontalTabs()
                      ? styles.tabLandscape
                      : styles.tabPortrait,
                    tabStyle,
                  ]}
                >
                  {this._renderIcon(scene)}
                  {this._renderLabel(scene)}
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </SafeAreaView>
      </Animated.View>
    );
  }
}

const DEFAULT_HEIGHT = 49;
const COMPACT_HEIGHT = 29;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#F7F7F7', // Default background color in iOS 10
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    flexDirection: 'row',
  },
  container: {
    flex: 1,
  },
  tabBarCompact: {
    height: COMPACT_HEIGHT,
  },
  tabBarRegular: {
    height: DEFAULT_HEIGHT,
  },
  tab: {
    flex: 1,
    alignItems: isIos ? 'center' : 'stretch',
  },
  tabPortrait: {
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  tabLandscape: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  iconWithoutLabel: {
    flex: 1,
  },
  iconWithLabel: {
    flexGrow: 1,
  },
  iconWithExplicitHeight: {
    height: Platform.isPad ? DEFAULT_HEIGHT : COMPACT_HEIGHT,
  },
  label: {
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  labelBeneath: {
    fontSize: 10,
    marginBottom: 1.5,
  },
  labelBeside: {
    fontSize: 13,
    marginLeft: 20,
  },
});

export default withOrientation(TabBarBottom);
