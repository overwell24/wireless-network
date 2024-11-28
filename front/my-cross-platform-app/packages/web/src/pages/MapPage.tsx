import React, { useState, useEffect, useRef } from 'react';
import { Map as KakaoMap, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { theme } from '../styles/theme';
import coffeeIcon from '../assets/coffee-icon.png';
import styled, { DefaultTheme } from 'styled-components';

type TransientProps = {
  $isOccupied: boolean;
};


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
}

interface TableStatus {
  [key: string]: number; // 0: 비어있음, 1: 사용중
}

interface TestLocation {
  id: string;
  place_name: string;
  lat: number;
  lng: number;
  address_name: string;
  tables_occupied_status: TableStatus;
  is_test: boolean;
}

const TEST_LOCATIONS: TestLocation[] = [
  {
    id: 'test-1',
    place_name: "4호관 405호",
    lat: 37.4504,
    lng: 126.654,
    address_name: "인천광역시 미추홀구 인하로 100 인하공업전문대학 4호관 1층",
    tables_occupied_status: {
      table_1: 0,
      table_2: 1,
      table_3: 1,
      table_4: 0,
      table_5: 0,
      table_6: 0,
      table_7: 1,
      table_8: 0,
      table_9: 1,
      table_10: 0
    },
    is_test: true
  }
];


// 실제 카페용 더미 좌석 데이터를 생성하는 함수
const generateDummySeats = (cafeId: string): TableStatus => {
  const numberOfTables = Math.floor(Math.random() * 6) + 5; // 5~10개의 테이블
  const tableStatus: TableStatus = {};
  
  for (let i = 1; i <= numberOfTables; i++) {
    // 60% 확률로 빈자리, 40% 확률로 사용중
    tableStatus[`table_${i}`] = Math.random() < 0.6 ? 0 : 1;
  }
  
  return tableStatus;
};

// 카페별 좌석 데이터를 저장할 Map 객체
const cafeSeatsMap: Map<string, TableStatus> = new Map<string, TableStatus>();

const COMMON_MARKER_IMAGE = {
  src: coffeeIcon,
  size: {
    width: 24,
    height: 24,
  },
};

const SeatLayout = ({ tableStatus }: { tableStatus: TableStatus }) => {
  return (
    <SeatContainer>
      <SeatTitle>좌석 배치도</SeatTitle>
      <SeatGrid>
        {Object.entries(tableStatus).map(([table, status]) => (
          <SeatItem key={table} $isOccupied={status === 1}>
          {table.replace('table_', '번 ')}
          {status === 1 ? '사용중' : '빈자리'}
        </SeatItem>
        ))}
      </SeatGrid>
    </SeatContainer>
  );
};

const MapPage = () => {
  const [cafes, setCafes] = useState<KakaoPlace[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<KakaoPlace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState({
    lat: 37.448201,
    lng: 126.654
  });

  const userLocationRef = useRef(userLocation);
  userLocationRef.current = userLocation;

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
          const realCafes = data.map(cafe => {
            const typedCafe = cafe as KakaoPlace;
  
            // 필요 시 좌석 데이터 더미 생성
            if (!cafeSeatsMap.has(typedCafe.id)) {
              cafeSeatsMap.set(typedCafe.id, generateDummySeats(typedCafe.id));
            }
            return {
              ...typedCafe,
              is_test: false, // 실제 카페 데이터
            };
          });
  
          // TEST_LOCATIONS 데이터를 KakaoPlace 형식으로 변환
          const testCafes: KakaoPlace[] = TEST_LOCATIONS.map(loc => ({
            id: loc.id,
            place_name: loc.place_name,
            category_name: '카페', // KakaoPlace 필드 추가
            phone: '', // KakaoPlace 필드 추가
            address_name: loc.address_name,
            road_address_name: loc.address_name,
            x: loc.lng.toString(), // KakaoPlace에서 x는 string 타입
            y: loc.lat.toString(), // KakaoPlace에서 y는 string 타입
            place_url: '#', // KakaoPlace 필드 추가
            is_test: true, // 테스트 데이터
          }));
  
          // realCafes에 포함되지 않은 테스트 데이터 추가
          const mergedCafes = [
            ...realCafes,
            ...testCafes.filter(
              testCafe => !realCafes.some(realCafe => realCafe.id === testCafe.id)
            ),
          ];
  
          setCafes(mergedCafes); // 병합된 데이터 설정
          setLoading(false);
        } else {
          // API 호출 실패 시 테스트 데이터만 표시
          const testCafes: KakaoPlace[] = TEST_LOCATIONS.map(loc => ({
            id: loc.id,
            place_name: loc.place_name,
            category_name: '카페',
            phone: '',
            address_name: loc.address_name,
            road_address_name: loc.address_name,
            x: loc.lng.toString(),
            y: loc.lat.toString(),
            place_url: '#',
            is_test: true,
          }));
          setCafes(testCafes);
          setError('주변 카페를 찾을 수 없습니다.');
          setLoading(false);
        }
      },
      {
        location: new window.kakao.maps.LatLng(lat, lng),
        radius: 1000,
        sort: window.kakao.maps.services.SortBy.DISTANCE,
      }
    );
  };
  
  
  
  

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: 37.4484,
            lng: 126.6574
          };
          setUserLocation(newLocation);
          searchNearbyCafes(newLocation.lat, newLocation.lng);
        },
        (error) => {
          console.error('위치 정보 가져오기 실패:', error);
          searchNearbyCafes(userLocationRef.current.lat, userLocationRef.current.lng);
        }
      );
    }
  }, []); // Empty dependency array to run once on mount

  const getCrowdedness = (cafeId: string) => {
    if (cafeId.startsWith('test-')) {
      const testLocation = TEST_LOCATIONS.find(loc => loc.id === cafeId);
      if (!testLocation?.tables_occupied_status) return 0;
  
      const totalTables = Object.keys(testLocation.tables_occupied_status).length;
      const occupiedTables = Object.values(testLocation.tables_occupied_status)
        .filter(status => status === 1).length;
      return Math.round((occupiedTables / totalTables) * 100);
    }
  
    const tableStatus = cafeSeatsMap.get(cafeId);
    if (tableStatus) {
      const totalTables = Object.keys(tableStatus).length;
      const occupiedTables = Object.values(tableStatus)
        .filter(status => status === 1).length;
      return Math.round((occupiedTables / totalTables) * 100);
    }
  
    return 0;
  };
  

  const getTableStatus = (cafeId: string): TableStatus | null => {
    if (cafeId.startsWith('test-')) {
      const testLocation = TEST_LOCATIONS.find(loc => loc.id === cafeId);
      return testLocation?.tables_occupied_status || null;
    }
    return cafeSeatsMap.get(cafeId) || null;
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
      
      <KakaoMap
        center={userLocation}
        style={{ width: '100%', height: '100%' }}
        level={2}
      >
        <MapMarker
          position={userLocation}
        />

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
                image={COMMON_MARKER_IMAGE}
              />
              <CustomOverlayMap
                position={{
                  lat: parseFloat(cafe.y) + 0.00005,
                  lng: parseFloat(cafe.x)
                }}
                yAnchor={1.5}
              >
                <MarkerLabel 
                  $crowdedness={crowdedness}
                  $isTest={cafe.is_test}
                >
                  {cafe.is_test ? '테스트' : `${crowdedness}%`}
                </MarkerLabel>
              </CustomOverlayMap>
            </React.Fragment>
          );
        })}
      </KakaoMap>

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

          <SeatLayout tableStatus={getTableStatus(selectedCafe.id) || {}} />
          
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

const MarkerLabel = styled.div<{ $crowdedness: number; $isTest?: boolean }>`
  background: ${({ $crowdedness, $isTest }) => {
    if ($isTest) return '#FFD700';
    if ($crowdedness >= 80) return theme.colors.primary;
    if ($crowdedness >= 50) return theme.colors.secondary;
    return theme.colors.tertiary;
  }};

  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  border: ${props => props.$isTest ? '2px solid #fff' : 'none'}; // $isTest 사용
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

const SeatContainer = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: ${theme.colors.background};
  border-radius: 8px;
`;

const SeatTitle = styled.h3`
  font-size: 1.1rem;
  color: ${theme.colors.text.primary};
  margin-bottom: 12px;
`;

const SeatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const SeatItem = styled.div<{ $isOccupied: boolean }>`
  padding: 8px;
  background: ${props => props.$isOccupied ? theme.colors.primary : theme.colors.tertiary};
  color: white;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
`;


export default MapPage;
