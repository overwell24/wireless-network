import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Navbar = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  
  if (route.name === 'Main') return null;

  return (
    <View style={styles.nav}>
      <TouchableOpacity 
        style={styles.navLogo} 
        onPress={() => navigation.navigate('Main')}
      >
        <Text style={styles.logoIcon}>☕️</Text>
        <Text style={styles.logoText}>카페 자리있어?</Text>
      </TouchableOpacity>
      
      <View style={styles.navItems}>
        <TouchableOpacity 
          style={[
            styles.navItem,
            route.name === 'Map' && styles.activeNavItem
          ]}
          onPress={() => navigation.navigate('Map')}
        >
          <Text style={[
            styles.navItemText,
            route.name === 'Map' && styles.activeNavItemText
          ]}>
            지도로 보기
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.navItem,
            route.name === 'List' && styles.activeNavItem
          ]}
          onPress={() => navigation.navigate('List')}
        >
          <Text style={[
            styles.navItemText,
            route.name === 'List' && styles.activeNavItemText
          ]}>
            목록으로 보기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  navItems: {
    flexDirection: 'row',
    gap: 15,
  },
  navItem: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  activeNavItem: {
    backgroundColor: '#FFE3E3',
  },
  navItemText: {
    color: '#666',
  },
  activeNavItemText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
});

export default Navbar;