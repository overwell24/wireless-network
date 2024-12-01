// src/screens/CafeDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Linking, 
  ActivityIndicator, 
  Dimensions 
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Icon } from '../components/Icon'; // 커스텀 Icon 컴포넌트 임포트
import type { RootStackParamList } from '../navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

interface TableStatus {
  [key: string]: number; // 0: 비어있음, 1: 사용중
}

interface CafeData {
  cafe_id: number;
  cafe_name: string;
  cafe_address: string;
  phone: string;
  table_status: TableStatus;
  lat: string;
  lng: string;
  place_url: string;
  is_test?: boolean;
}

type CafeDetailRouteProp = RouteProp<RootStackParamList, 'CafeDetail'>;
type CafeDetailNavigationProp = StackNavigationProp<RootStackParamList, 'CafeDetail'>;

const CafeDetailPage = () => {
  const route = useRoute<CafeDetailRouteProp>();
  const navigation = useNavigation<CafeDetailNavigationProp>();
  const [cafeData, setCafeData] = useState<CafeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const generateDummySeats = (cafeId: string): TableStatus => {
    const numberOfTables = Math.floor(Math.random() * 6) + 5;
    const tableStatus: TableStatus = {};
    for (let i = 1; i <= numberOfTables; i++) {
      tableStatus[`table_${i}`] = Math.random() < 0.6 ? 0 : 1;
    }
    return tableStatus;
  };

  const fetchCafeData = async () => {
    try {
      const response = await fetch(`http://15.165.161.251/api/cafes`);
      const data = await response.json();
      const targetCafe = data.find((cafe: any) => cafe.cafe_id.toString() === route.params.id);
      
      if (targetCafe) {
        const cafeInfo: CafeData = {
          cafe_id: targetCafe.cafe_id,
          cafe_name: targetCafe.cafe_name,
          cafe_address: targetCafe.cafe_address,
          phone: targetCafe.phone || '',
          table_status: targetCafe.table_status,
          lat: targetCafe.lat,
          lng: targetCafe.lng,
          place_url: targetCafe.place_url || '#',
          is_test: targetCafe.cafe_id === 1
        };
        setCafeData(cafeInfo);
        setLoading(false);
      } else {
        setError('카페 정보를 찾을 수 없습니다');
        setLoading(false);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch cafe details:', error);
      setError('데이터를 불러오는데 실패했습니다');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCafeData();
    const interval = setInterval(fetchCafeData, 60000);
    return () => clearInterval(interval);
  }, [route.params.id]);

  const calculateCrowdedness = () => {
    if (!cafeData?.table_status) return 0;
    const totalSeats = Object.keys(cafeData.table_status).length;
    const occupiedSeats = Object.values(cafeData.table_status).filter(status => status === 1).length;
    return Math.round((occupiedSeats / totalSeats) * 100);
  };

  const getCrowdednessColor = (percentage: number) => {
    if (percentage >= 80) return '#FF6B6B';
    if (percentage >= 50) return '#FFB946';
    return '#51CF66';
  };

  const getTimeAgo = () => {
    const diff = new Date().getTime() - lastUpdated.getTime();
    const minutes = Math.floor(diff / 60000);
    return minutes === 0 ? '방금 전' : `${minutes}분 전`;
  };

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FF6B6B" />
      <Text style={styles.loadingText}>데이터를 불러오는 중...</Text>
    </View>
  );

  if (error) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );

  if (!cafeData) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>카페 정보를 찾을 수 없습니다</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="ArrowLeft" color="#666" size={20} />
          <Text style={styles.backButtonText}>뒤로 가기</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{cafeData.cafe_name}</Text>
          <Text style={styles.address}>{cafeData.cafe_address}</Text>
        </View>
      </View>

      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <View style={styles.statusIcon}>
            <Icon name="Users" color="#666" size={20} />
          </View>
          <View style={styles.statusText}>
            <Text style={styles.statusLabel}>현재 혼잡도</Text>
            <Text style={[styles.statusValue, { color: getCrowdednessColor(calculateCrowdedness()) }]}>
              {calculateCrowdedness()}%
            </Text>
          </View>
        </View>

        <View style={styles.statusItem}>
          <View style={styles.statusIcon}>
            <Icon name="Coffee" color="#666" size={20} />
          </View>
          <View style={styles.statusText}>
            <Text style={styles.statusLabel}>이용 가능 좌석</Text>
            <Text style={styles.statusValue}>
              {Object.values(cafeData.table_status).filter(status => status === 0).length}석
            </Text>
          </View>
        </View>

        <View style={styles.statusItem}>
          <View style={styles.statusIcon}>
            <Icon name="Clock" color="#666" size={20} />
          </View>
          <View style={styles.statusText}>
            <Text style={styles.statusLabel}>마지막 업데이트</Text>
            <Text style={styles.statusValue}>{getTimeAgo()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.seatMapContainer}>
        <Text style={styles.seatMapTitle}>좌석 배치도</Text>
        <View style={styles.seatGrid}>
          {Object.entries(cafeData.table_status).map(([seatId, isOccupied]) => (
            <View
              key={seatId}
              style={[
                styles.seat,
                { backgroundColor: isOccupied === 1 ? '#FF6B6B' : '#51CF66' }
              ]}
            >
              <Text style={styles.seatLabel}>{seatId}</Text>
              <Text style={styles.seatStatus}>
                {isOccupied === 1 ? '사용중' : '이용 가능'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#51CF66' }]} />
          <Text style={styles.legendText}>이용 가능</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF6B6B' }]} />
          <Text style={styles.legendText}>사용중</Text>
        </View>
      </View>

      {!cafeData.is_test && cafeData.place_url && (
        <TouchableOpacity 
          style={styles.kakaoMapButton}
          onPress={() => Linking.openURL(cafeData.place_url)}
        >
          <Text style={styles.kakaoMapButtonText}>카카오맵에서 보기</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.updateInfo}>
        * 좌석 정보는 1분마다 자동으로 업데이트됩니다
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
  },
  header: {
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 16,
  },
  backButtonText: {
    marginLeft: 8,
    color: '#666',
  },
  headerContent: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
  },
  address: {
    color: '#666',
    fontSize: 16,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    alignItems: 'center',
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  seatMapContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  seatMapTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 20,
  },
  seatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  seat: {
    width: (Dimensions.get('window').width - 120) / 3,
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  seatLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  seatStatus: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    color: '#666',
  },
  kakaoMapButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 60,
    marginVertical: 20,
  },
  kakaoMapButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  updateInfo: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 16,
    marginBottom: 30,
  },
});

export default CafeDetailPage;
