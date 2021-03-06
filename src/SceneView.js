/* @flow */

import * as React from 'react';
import propTypes from 'prop-types';

export default class SceneView extends React.Component<*> {
  static childContextTypes = {
    navigation: propTypes.object.isRequired,
  };

  getChildContext() {
    return {
      navigation: this.props.navigation,
    };
  }

  render() {
    const { screenProps, navigation, component: Component } = this.props;
    return <Component screenProps={screenProps} navigation={navigation} />;
  }
}
