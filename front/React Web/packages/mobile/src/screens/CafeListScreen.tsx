// src/screens/CafeListScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Icon } from '../components/Icon';

interface TableStatus {
  [key: string]: number;
}

interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  place_url: string;
  is_test?: boolean;
  table_status?: TableStatus;
}

type CafeListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CafeList'>;

const CafeListScreen = () => {
  const navigation = useNavigation<CafeListScreenNavigationProp>();
  const [cafes, setCafes] = useState<KakaoPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateDummySeats = (cafeId: string): TableStatus => {
    const numberOfTables = Math.floor(Math.random() * 6) + 5;
    const tableStatus: TableStatus = {};
    for (let i = 1; i <= numberOfTables; i++) {
      tableStatus[`table_${i}`] = Math.random() < 0.6 ? 0 : 1;
    }
    return tableStatus;
  };

  const fetchCafes = async () => {
    try {
      const response = await fetch('http://15.165.161.251/api/cafes');
      const data = await response.json();
      const updatedCafes: KakaoPlace[] = data.map((item: any) => ({
        id: item.cafe_id.toString(),
        place_name: item.cafe_name,
        category_name: '카페',
        phone: item.phone || '',
        address_name: item.cafe_address,
        road_address_name: item.cafe_address,
        x: item.lng.toString(),
        y: item.lat.toString(),
        place_url: item.place_url || '#',
        is_test: item.cafe_id === 1,
        table_status: item.table_status || (item.cafe_id === 1 ? undefined : generateDummySeats(item.cafe_id.toString())),
      }));

      setCafes(updatedCafes);
      setLoading(false);
    } catch (error) {
      console.error("데이터 로드 오류:", error);
      setError("API 호출 실패");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCafes();
    const interval = setInterval(fetchCafes, 60000);
    return () => clearInterval(interval);
  }, []);

  const calculateCrowdedness = (table_status?: TableStatus) => {
    if (!table_status) return 0;
    const totalSeats = Object.keys(table_status).length;
    const occupiedSeats = Object.values(table_status).filter(status => status === 1).length;
    return Math.round((occupiedSeats / totalSeats) * 100);
  };

  const getCrowdednessColor = (percentage: number) => {
    if (percentage >= 80) return '#FF6B6B';
    if (percentage >= 50) return '#FFB946';
    return '#51CF66';
  };

  const renderCafeItem = ({ item }: { item: KakaoPlace }) => {
    const crowdedness = calculateCrowdedness(item.table_status);

    return (
      <TouchableOpacity 
        style={[styles.cafeCard, item.is_test && styles.testCard]}
        onPress={() => navigation.navigate('CafeDetail', { id: item.id })}
      >
        <View style={styles.cafeInfo}>
          <Text style={styles.cafeName}>{item.place_name}</Text>
          <Text style={styles.addressText}>
            {item.road_address_name || item.address_name}
          </Text>
          {item.phone && (
            <Text style={styles.phoneText}>{item.phone}</Text>
          )}
        </View>
        
        <View style={styles.crowdednessInfo}>
          <View style={styles.crowdednessBar}>
            <View 
              style={[
                styles.crowdednessProgress,
                {
                  width: `${crowdedness}%`,
                  backgroundColor: getCrowdednessColor(crowdedness)
                }
              ]} 
            />
          </View>
          <Text style={styles.crowdednessText}>
            혼잡도: {crowdedness}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>주변 카페 목록</Text>
      </View>

      <FlatList<KakaoPlace>
        data={cafes}
        renderItem={renderCafeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  listContainer: {
    padding: 16,
  },
  cafeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testCard: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  cafeInfo: {
    marginBottom: 12,
  },
  cafeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 14,
    color: '#666',
  },
  crowdednessInfo: {
    marginTop: 12,
  },
  crowdednessBar: {
    height: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  crowdednessProgress: {
    height: '100%',
  },
  crowdednessText: {
    fontSize: 14,
    color: '#666',
  },
});

export default CafeListScreen;
