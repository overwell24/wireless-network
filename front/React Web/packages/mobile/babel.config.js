module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
        },
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        // 필요한 경우 옵션을 추가
        // 예: corejs: 3
      },
    ],
  ],
};
