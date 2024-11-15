import React, { useState, useEffect } from 'react';
import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { mockCafes } from '../mocks/cafeData';

interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string;  // longitude
  y: string;  // latitude
  place_url: string;
  is_test?: boolean;  // 테스트용 위치 구분
}

const TEST_LOCATIONS = [
  {
    id: 'test-1',
    place_name: "4호관 405호",
    lat: 37.448201,
    lng: 126.658518,
    address_name: "인천광역시 미추홀구 인하로 100 인하공업전문대학 4호관 1층",
    tables_occupied_status: {
      table_1: 0,
      table_2: 1,
      table_3: 1,
      table_4: 0,
      table_5: 0,
    },
    is_test: true
  }
];

const MapPage = () => {
  const [cafes, setCafes] = useState<KakaoPlace[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<KakaoPlace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState({
    lat: 37.448201, // 인하공전 4호관 위도
    lng: 126.658518 // 인하공전 4호관 경도
  });

  // 실제 카페와 테스트 위치 모두 검색
  const searchNearbyCafes = (lat: number, lng: number) => {
    if (!window.kakao?.maps?.services) {
      console.error('Kakao Maps Services not loaded');
      setError('지도 서비스를 불러올 수 없습니다.');
      setLoading(false);
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    
    ps.categorySearch(
      'CE7',
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          // 실제 카페 데이터에 is_test: false 추가
          const realCafes = data.map(cafe => ({
            ...cafe,
            is_test: false
          }));

          // 테스트 위치를 KakaoPlace 형식으로 변환
          const testCafes = TEST_LOCATIONS.map(loc => ({
            id: loc.id,
            place_name: loc.place_name,
            category_name: '카페',
            phone: '',
            address_name: loc.address_name,
            road_address_name: loc.address_name,
            x: loc.lng.toString(),
            y: loc.lat.toString(),
            place_url: '#',
            is_test: true
          }));

          // 실제 카페와 테스트 위치 합치기
          setCafes([...realCafes, ...testCafes]);
          setLoading(false);
        } else {
          setError('주변 카페를 찾을 수 없습니다.');
          setLoading(false);
        }
      },
      {
        location: new window.kakao.maps.LatLng(lat, lng),
        radius: 1000,
        sort: window.kakao.maps.services.SortBy.DISTANCE
      }
    );
  };

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: 37.4484, // 항상 인하공전 4호관 위치 사용
            lng: 126.6574
          };
          setUserLocation(newLocation);
          searchNearbyCafes(newLocation.lat, newLocation.lng);
        },
        (error) => {
          console.error('위치 정보 가져오기 실패:', error);
          searchNearbyCafes(userLocation.lat, userLocation.lng);
        }
      );
    }
  }, []);

  // 혼잡도 계산
  const getCrowdedness = (cafeId: string) => {
    // 테스트 위치의 경우
    if (cafeId.startsWith('test-')) {
      const testLocation = TEST_LOCATIONS.find(loc => loc.id === cafeId);
      if (!testLocation?.tables_occupied_status) return 0;
      
      const totalTables = Object.keys(testLocation.tables_occupied_status).length;
      const occupiedTables = Object.values(testLocation.tables_occupied_status)
        .filter(status => status === 1).length;
      return Math.round((occupiedTables / totalTables) * 100);
    }
    
    // 실제 카페의 경우 랜덤 혼잡도 반환
    return Math.floor(Math.random() * 100);
  };

  const getCrowdednessColor = (crowdedness: number) => {
    if (crowdedness >= 80) return theme.colors.primary;
    if (crowdedness >= 50) return theme.colors.secondary;
    return theme.colors.tertiary;
  };

  return (
    <Container>
      {loading && <LoadingSpinner>로딩 중...</LoadingSpinner>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Map
        center={userLocation}
        style={{ width: '100%', height: '100%' }}
        level={2}
      >
        {/* 현재 위치 마커 */}
        <MapMarker
          position={userLocation}
          image={{
            src: '/my-location-marker.png',
            size: { width: 24, height: 24 },
          }}
        />

        {/* 카페 마커들 */}
        {cafes.map(cafe => {
          const crowdedness = getCrowdedness(cafe.id);
          return (
            <React.Fragment key={cafe.id}>
              <MapMarker
                position={{
                  lat: parseFloat(cafe.y),
                  lng: parseFloat(cafe.x)
                }}
                onClick={() => setSelectedCafe(cafe)}
                image={cafe.is_test ? {
                  src: 'data:image/png;base64,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',  // 테스트 위치용 다른 마커 이미지
                  size: { width: 24, height: 24 },
                } : undefined}
              />
              <CustomOverlayMap
                position={{
                  lat: parseFloat(cafe.y),
                  lng: parseFloat(cafe.x)
                }}
                yAnchor={1.5}
              >
                <MarkerLabel 
                  crowdedness={crowdedness}
                  isTest={cafe.is_test}
                >
                  {crowdedness}%
                </MarkerLabel>
              </CustomOverlayMap>
            </React.Fragment>
          );
        })}
      </Map>

      {/* 선택된 카페 정보 패널 */}
      {selectedCafe && (
        <InfoPanel>
          <CloseButton onClick={() => setSelectedCafe(null)}>×</CloseButton>
          <CafeName>{selectedCafe.place_name}</CafeName>
          <AddressText>
            {selectedCafe.road_address_name || selectedCafe.address_name}
          </AddressText>
          
          <StatusInfo>
            <CrowdednessBar>
              <CrowdednessProgress 
                width={getCrowdedness(selectedCafe.id)}
                color={getCrowdednessColor(getCrowdedness(selectedCafe.id))}
              />
            </CrowdednessBar>
            <StatusText>
              현재 혼잡도: {getCrowdedness(selectedCafe.id)}%
              {!selectedCafe.is_test && selectedCafe.phone && (
                <>
                  <br />
                  전화번호: {selectedCafe.phone}
                </>
              )}
            </StatusText>
          </StatusInfo>
          
          <ButtonGroup>
            {!selectedCafe.is_test && (
              <DetailButton 
                onClick={() => window.open(selectedCafe.place_url, '_blank')}
              >
                카카오맵에서 보기
              </DetailButton>
            )}
          </ButtonGroup>
        </InfoPanel>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 60px);
  position: relative;
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  color: ${theme.colors.primary};
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff6b6b;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  z-index: 1000;
`;

const MarkerLabel = styled.div<{ crowdedness: number; isTest?: boolean }>`
  background: ${props => {
    if (props.isTest) {
      return '#4A90E2';  // 테스트 위치는 파란색 계열
    }
    if (props.crowdedness >= 80) return theme.colors.primary;
    if (props.crowdedness >= 50) return theme.colors.secondary;
    return theme.colors.tertiary;
  }};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  border: ${props => props.isTest ? '2px solid #fff' : 'none'};
`;

const InfoPanel = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: ${theme.shadows.medium};
  width: 300px;
  z-index: 1000;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${theme.colors.text.secondary};
`;

const CafeName = styled.h2`
  font-size: 1.5rem;
  color: ${theme.colors.text.primary};
  margin-bottom: 8px;
`;

const AddressText = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
  margin: 8px 0;
`;

const StatusInfo = styled.div`
  margin: 16px 0;
`;

const CrowdednessBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${theme.colors.background};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const CrowdednessProgress = styled.div<{ width: number; color: string }>`
  width: ${props => props.width}%;
  height: 100%;
  background: ${props => props.color};
  transition: width 0.3s ease;
`;

const StatusText = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

const DetailButton = styled.button`
  width: 100%;
  padding: 10px;
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;

  &:hover {
    background: ${theme.colors.hover};
  }
`;

export default MapPage;