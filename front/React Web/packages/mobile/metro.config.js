const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

// 루트 node_modules 경로를 추가
defaultConfig.resolver.nodeModulesPaths = [
  path.resolve(__dirname, '/Users/taekyou/wireless-network/front/my-cross-platform-app/node_modules'), // 프로젝트 루트의 node_modules 경로
  path.resolve(__dirname, '/Users/taekyou/wireless-network/front/my-cross-platform-app/packages/mobile/node_modules'), // 현재 패키지의 node_modules 경로
];

module.exports = mergeConfig(defaultConfig, {
  resolver: {
    // 추가 설정이 필요하다면 여기에 작성
  },
  // 다른 설정이 필요하다면 여기에 작성
});
