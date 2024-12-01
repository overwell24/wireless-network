import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Main: undefined;
  Map: undefined;
  List: undefined;
  CafeDetail: { id: string };
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;