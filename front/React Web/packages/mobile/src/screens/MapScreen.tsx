import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Platform,
  Dimensions
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

interface TableStatus {
  [key: string]: number;
}

const INITIAL_LOCATION = {
  latitude: 37.448258,
  longitude: 126.658601,
};

const MapScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [cafes, setCafes] = useState<KakaoPlace[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<KakaoPlace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const response = await fetch('http://15.165.161.251/api/cafes');
        const data = await response.json();
        setCafes(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch cafes:', error);
        setError('데이터를 불러오는데 실패했습니다');
        setLoading(false);
      }
    };

    fetchCafes();
    const interval = setInterval(fetchCafes, 60000);
    return () => clearInterval(interval);
  }, []);

  const getCrowdedness = (cafe: KakaoPlace) => {
    if (!cafe.table_status) return 0;
    const totalTables = Object.keys(cafe.table_status).length;
    const occupiedTables = Object.values(cafe.table_status).filter(status => status === 1).length;
    return Math.round((occupiedTables / totalTables) * 100);
  };

  // 카카오맵 HTML 생성
  const generateMapHTML = () => {
    const markers = cafes.map(cafe => `
      var marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(${cafe.y}, ${cafe.x}),
        map: map
      });
      
      kakao.maps.event.addListener(marker, 'click', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'marker_click',
          cafe: ${JSON.stringify(cafe)}
        }));
      });
    `).join('\n');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_MAP_KEY"></script>
        <style>
          body, html { margin: 0; padding: 0; width: 100%; height: 100%; }
          #map { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var container = document.getElementById('map');
          var options = {
            center: new kakao.maps.LatLng(${INITIAL_LOCATION.latitude}, ${INITIAL_LOCATION.longitude}),
            level: 3
          };
          var map = new kakao.maps.Map(container, options);
          ${markers}
        </script>
      </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'marker_click') {
        setSelectedCafe(data.cafe);
      }
    } catch (error) {
      console.error('Failed to parse WebView message:', error);
    }
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
      <WebView
        style={styles.map}
        source={{ html: generateMapHTML() }}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />

      {selectedCafe && (
        <View style={styles.infoPanel}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setSelectedCafe(null)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.cafeName}>{selectedCafe.place_name}</Text>
          <Text style={styles.addressText}>
            {selectedCafe.road_address_name || selectedCafe.address_name}
          </Text>

          <View style={styles.crowdednessBar}>
            <View 
              style={[
                styles.crowdednessProgress, 
                { width: `${getCrowdedness(selectedCafe)}%` }
              ]} 
            />
          </View>

          <TouchableOpacity 
            style={styles.detailButton}
            onPress={() => navigation.navigate('CafeDetail', { id: selectedCafe.id })}
          >
            <Text style={styles.buttonText}>상세 정보 보기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
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
  infoPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
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
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  cafeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  crowdednessBar: {
    height: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  crowdednessProgress: {
    height: '100%',
    backgroundColor: '#FF6B6B',
  },
  detailButton: {
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default MapScreen;