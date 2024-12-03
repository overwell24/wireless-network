// src/screens/MainScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground,
  Platform,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Icon } from '../components/Icon';

const { width } = Dimensions.get('window');

type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const MainScreen = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();

  const renderServiceCard = (
    iconName: keyof typeof import('lucide-react-native'),
    title: string,
    description: string
  ) => (
    <View style={styles.serviceCard} key={title}>
      <View style={styles.serviceIcon}>
        <Icon name={iconName} color="#FF6B6B" size={32} />
      </View>
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceDescription}>{description}</Text>
    </View>
  );

  const renderTestimonialCard = (
    name: string,
    review: string
  ) => (
    <View style={styles.testimonialCard} key={name}>
      <View style={styles.userIconWrapper}>
        <Icon name="User2" color="#FF6B6B" size={48} />
      </View>
      <Text style={styles.userName}>{name}</Text>
      <Text style={styles.userReview}>{review}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require('../assets/hero-background.jpg')}
        style={styles.heroSection}
        imageStyle={styles.heroImage}
      >
        <View style={styles.overlay} />
        <View style={styles.heroContent}>
          <Text style={styles.mainTitle}>카페 자리있어?</Text>
          <Text style={styles.subtitle}>
            실시간으로 확인하는 스마트한 카페 좌석 현황
          </Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.mainButton}
              onPress={() => navigation.navigate('CafeList')}
            >
              <Icon name="Map" color="white" size={24} />
              <Text style={styles.mainButtonText}>지도에서 찾기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('CafeList')}
            >
              <Icon name="List" color="#FF6B6B" size={24} />
              <Text style={styles.secondaryButtonText}>목록에서 찾기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>서비스 소개</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesWrapper}
        >
          {renderServiceCard(
            "Coffee",
            "실시간 좌석 현황",
            "원하는 카페의 실시간 좌석 상황을 확인하고 바로 예약하세요."
          )}
          {renderServiceCard(
            "ChartBar",
            "혼잡도 체크",
            "현재 카페의 혼잡도를 확인하여 여유로운 시간을 계획하세요."
          )}
          {renderServiceCard(
            "Search",
            "스마트 검색",
            "위치 기반 검색으로 근처의 다양한 카페를 빠르게 찾아보세요."
          )}
        </ScrollView>
      </View>

      <View style={styles.testimonialsSection}>
        <Text style={styles.sectionTitle}>사용자 후기</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.testimonialsWrapper}
        >
          {renderTestimonialCard(
            "이태규",
            "카페 자리있어 덕분에 항상 편리하게 카페를 찾을 수 있어요! 실시간 좌석 현황이 정말 유용하고, 사용이 간편해서 자주 이용하고 있습니다."
          )}
          {renderTestimonialCard(
            "나예원",
            "실시간 좌석 현황 덕분에 카페에서 기다리는 시간이 없어졌어요. 혼잡도 체크 기능도 덕분에 평소보다 더 여유롭게 시간을 보낼 수 있었습니다."
          )}
          {renderTestimonialCard(
            "민찬기",
            "스마트 검색 기능이 정말 유용해요. 근처에 새로운 카페를 발견하고 바로 예약까지 할 수 있어서 좋아요."
          )}
          {renderTestimonialCard(
            "박상천",
            "카페 자리있어를 사용한 후로, 카페 선택이 훨씬 쉬워졌어요. 특히, 실시간 업데이트 덕분에 항상 최신 정보를 얻을 수 있어 만족합니다."
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  heroSection: {
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    opacity: 0.8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  heroContent: {
    padding: 20,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 15,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  mainButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#FF6B6B',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  servicesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
    marginVertical: 20,
  },
  servicesWrapper: {
    paddingHorizontal: 10,
  },
  serviceCard: {
    width: width * 0.7,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  serviceIcon: {
    alignItems: 'center',
    marginBottom: 15,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 10,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  testimonialsSection: {
    padding: 20,
  },
  testimonialsWrapper: {
    paddingHorizontal: 10,
  },
  testimonialCard: {
    width: width * 0.7,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 10,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  userIconWrapper: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  userReview: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MainScreen;
