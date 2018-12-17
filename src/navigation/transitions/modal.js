import { get } from 'lodash';
import { Animated } from 'react-native';
import { updateTransitionProps } from '../../redux/navigation';
import store from '../../redux/store';
import { deviceUtils, statusBar } from '../../utils';

export const transitionName = 'modal';

export default function modal(navigation, transitionProps, prevTransitionProps) {
  const nextEffect = get(transitionProps, 'scene.descriptor.options.effect');
  const prevEffect = get(prevTransitionProps, 'scene.descriptor.options.effect');
  const nextIndex = get(transitionProps, 'index');
  const prevIndex = get(prevTransitionProps, 'index', nextIndex - 1);

  if (nextEffect === transitionName) {
    statusBar.setBarStyle('light-content', true);
  }

  if (prevEffect === transitionName) {
    statusBar.setBarStyle('dark-content', true);
  }

  return {
    transitionSpec: {
      timing: nextEffect === transitionName && nextIndex > prevIndex ? Animated.spring : Animated.timing,
      tension: 120,
      friction: 12,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps = {}) => {
      const {
        layout,
        position,
        scene,
      } = sceneProps;

      store.dispatch(updateTransitionProps({
        nextIndex,
        prevIndex,
        position,
        effect: transitionName,
      }));

      const opacityEnd = 0.75;
      const translateYStart = deviceUtils.dimensions.height;

      if (nextEffect === transitionName && scene.index === prevIndex && nextIndex > prevIndex) {
        const opacity = position.interpolate({
          inputRange: [prevIndex, nextIndex],
          outputRange: [1, opacityEnd],
        });

        return {
          opacity,
        };
      }

      if (nextEffect === transitionName && scene.index === nextIndex && nextIndex > prevIndex) {
        const translateY = position.interpolate({
          inputRange: [prevIndex, nextIndex],
          outputRange: [translateYStart, 0],
        });

        return {
          transform: [{
            translateY,
          }],
        };
      }

      if (prevEffect === transitionName && scene.index === nextIndex && nextIndex < prevIndex) {
        const opacity = position.interpolate({
          inputRange: [nextIndex, prevIndex],
          outputRange: [1, opacityEnd],
        });

        return {
          opacity,
        };
      }

      if (prevEffect === transitionName && scene.index === prevIndex && nextIndex < prevIndex) {
        const translateY = position.interpolate({
          inputRange: [nextIndex, prevIndex],
          outputRange: [translateYStart, 0],
        });

        return {
          transform: [{
            translateY,
          }],
        };
      }

      const width = layout.initWidth;
      const translateX = position.interpolate({
        inputRange: [scene.index - 1, scene.index],
        outputRange: [width, 0],
      });

      return {
        overflow: 'hidden',
        transform: [{
          translateX,
        }],
      };
    },
  };
}
