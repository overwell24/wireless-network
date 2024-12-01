import React, { useState, useEffect } from 'react';
import { Map as KakaoMap, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import coffeeIcon from '../assets/coffee-icon.png';
import styled from 'styled-components';

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
  table_status?: TableStatus;
}

interface TableStatus {
  [key: string]: number; // 0: 비어있음, 1: 사용중
}

const COMMON_MARKER_IMAGE = {
  src: coffeeIcon,
  size: {
    width: 28,
    height: 28,
  },
};

// 좌석 상태를 랜덤으로 생성하는 함수
const generateDummySeats = (cafeId: string): TableStatus => {
  const numberOfTables = Math.floor(Math.random() * 6) + 5; // 5~10개의 테이블
  const tableStatus: TableStatus = {};

  for (let i = 1; i <= numberOfTables; i++) {
    tableStatus[`table_${i}`] = Math.random() < 0.6 ? 0 : 1; // 60% 확률로 빈자리
  }

  return tableStatus;
};

// 좌석 레이아웃 컴포넌트
const SeatLayout = ({ tableStatus, onViewMore }: { tableStatus: TableStatus; onViewMore: () => void }) => {
  return (
    <SeatContainer>
      <SeatTitle>좌석 미리보기</SeatTitle>
      <SeatGrid>
        {Object.entries(tableStatus).slice(0, 4).map(([seatId, isOccupied]) => (
          <Seat key={seatId} $isOccupied={isOccupied === 1}>
            <SeatLabel>{seatId}</SeatLabel>
            <SeatStatus>{isOccupied === 1 ? '사용중' : '빈좌석'}</SeatStatus>
          </Seat>
        ))}
      </SeatGrid>
      <ViewMoreText onClick={onViewMore}>전체 좌석 보기 ↗</ViewMoreText>
    </SeatContainer>
  );
};

// 혼잡도 색상 계산
const getCrowdednessColor = (crowdedness: number) => {
  if (crowdedness >= 80) return theme.colors.primary;
  if (crowdedness >= 50) return theme.colors.secondary;
  return theme.colors.tertiary;
};

// MapPage 컴포넌트
const MapPage = () => {
  const navigate = useNavigate();
  const [cafes, setCafes] = useState<KakaoPlace[]>([]);
  const [kakaoPlaces, setKakaoPlaces] = useState<KakaoPlace[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<KakaoPlace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 인하공업전문대학교의 고정된 좌표
  const [center] = useState({ lat: 37.448258, lng: 126.658601 });

  // 카카오 Places 서비스 초기화 (한 번만 호출)
  const searchNearbyCafes = (latitude: number, longitude: number) => {
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      const places = new window.kakao.maps.services.Places();
      
      const searchOptions: kakao.maps.services.PlacesSearchOptions = {
        location: new window.kakao.maps.LatLng(latitude, longitude),
        radius: 1000,
        category_group_code: 'CE7'
      };

      places.categorySearch('CE7', 
        (result: any, status: kakao.maps.services.Status) => {
          if (status === kakao.maps.services.Status.OK) {
            const kakaoResults: KakaoPlace[] = result.map((place: any) => ({
              id: place.id,
              place_name: place.place_name,
              category_name: place.category_name,
              phone: place.phone,
              address_name: place.address_name,
              road_address_name: place.road_address_name,
              x: place.x,
              y: place.y,
              place_url: place.place_url,
              table_status: generateDummySeats(place.id)
            }));
            setKakaoPlaces(kakaoResults);
          }
        },
        searchOptions
      );
    }
  };

  // 실제 API에서 카페 데이터를 가져오는 함수
  const fetchCafes = () => {
    fetch('http://15.165.161.251/api/cafes')
      .then((response) => response.json())
      .then((data) => {
        const realCafeData = data.find((item: any) => item.cafe_id === 1);
        
        if (realCafeData) {
          const updatedCafe: KakaoPlace = {
            id: realCafeData.cafe_id.toString(),
            place_name: realCafeData.cafe_name,
            category_name: '카페',
            phone: realCafeData.phone || '',
            address_name: realCafeData.cafe_address,
            road_address_name: realCafeData.cafe_address,
            x: realCafeData.lng.toString(),
            y: realCafeData.lat.toString(),
            place_url: realCafeData.place_url || '#',
            is_test: true,
            table_status: realCafeData.table_status,
          };
    
          const dummyCafes = data
            .filter((item: any) => item.cafe_id !== 1)
            .map((item: any) => ({
              id: item.cafe_id.toString(),
              place_name: item.cafe_name,
              category_name: '카페',
              phone: item.phone || '',
              address_name: item.cafe_address,
              road_address_name: item.cafe_address,
              x: item.lng.toString(),
              y: item.lat.toString(),
              place_url: item.place_url || '#',
              is_test: false,
              table_status: generateDummySeats(item.cafe_id.toString()),
            }));
    
          const allCafes = [updatedCafe, ...dummyCafes];
          setCafes(allCafes);
          setLoading(false);
        } else {
          setError("카페 데이터 로드 실패: cafe_id 1 데이터 없음");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("데이터 로드 오류:", error);
        setError("API 호출 실패");
        setLoading(false);
      });
  };

  useEffect(() => {
    // 초기 로드 시 로컬 카페 데이터 한 번 가져오기
    searchNearbyCafes(center.lat, center.lng);
  }, [center.lat, center.lng]);

  useEffect(() => {
    // 초기 데이터 가져오기
    fetchCafes();
    
    // 1초마다 실제 API 데이터 갱신
    const interval = setInterval(() => {
      fetchCafes();
    }, 1000); // 1000ms = 1초

    // 컴포넌트 언마운트 시 인터벌 클리어
    return () => clearInterval(interval);
  }, []);

  // 혼잡도 계산
  const getCrowdedness = (cafeId: string) => {
    const cafe = [...cafes, ...kakaoPlaces].find((cafe) => cafe.id === cafeId);
    if (!cafe || !cafe.table_status) return 0;

    const totalTables = Object.keys(cafe.table_status).length;
    const occupiedTables = Object.values(cafe.table_status).filter((status) => status === 1).length;
    return Math.round((occupiedTables / totalTables) * 100);
  };

  // 좌석 상태 가져오기
  const getTableStatus = (cafeId: string): TableStatus | null => {
    const cafe = [...cafes, ...kakaoPlaces].find((cafe) => cafe.id === cafeId);
    return cafe ? cafe.table_status || null : null;
  };

  // 마커 렌더링 함수
  const renderMarkers = () => {
    const allPlaces = [...cafes, ...kakaoPlaces];
    
    return allPlaces.map((place) => {
      const crowdedness = getCrowdedness(place.id);
      return (
        <React.Fragment key={place.id}>
          <MapMarker
            position={{
              lat: parseFloat(place.y),
              lng: parseFloat(place.x),
            }}
            onClick={() => setSelectedCafe(place)}
            image={COMMON_MARKER_IMAGE}
          />
          <CustomOverlayMap
            position={{
              lat: parseFloat(place.y) + 0.00005,
              lng: parseFloat(place.x),
            }}
            yAnchor={1.5}
          >
            <MarkerLabel 
              $crowdedness={crowdedness} 
              $isTest={place.is_test}
            >
              {place.is_test ? '테스트' : `${crowdedness}%`}
            </MarkerLabel>
          </CustomOverlayMap>
        </React.Fragment>
      );
    });
  };

  return (
    <Container>
      {loading && <LoadingSpinner>로딩 중...</LoadingSpinner>}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <KakaoMap 
        center={center}
        style={{ width: '100%', height: '100%' }} 
        level={3}
      >
        {renderMarkers()}
      </KakaoMap>

      {selectedCafe && (
        <InfoPanel>
          <CloseButton onClick={() => setSelectedCafe(null)}>×</CloseButton>
          <CafeName>{selectedCafe.place_name}</CafeName>
          <AddressText>{selectedCafe.road_address_name || selectedCafe.address_name}</AddressText>

          <StatusInfo>
            <CrowdednessBar>
              <CrowdednessProgress 
                width={getCrowdedness(selectedCafe.id)} 
                color={getCrowdednessColor(getCrowdedness(selectedCafe.id))} 
              />
            </CrowdednessBar>
            <StatusText>현재 혼잡도: {getCrowdedness(selectedCafe.id)}%</StatusText>
          </StatusInfo>

          <SeatLayout 
            tableStatus={getTableStatus(selectedCafe.id) || {}} 
            onViewMore={() => navigate(`/cafe/${selectedCafe.id}`)}
          />

          <ButtonGroup>
            <DetailButton onClick={() => navigate(`/cafe/${selectedCafe.id}`)}>
              상세 정보 보기
            </DetailButton>
            {!selectedCafe.is_test && (
              <DetailButton $secondary onClick={() => window.open(selectedCafe.place_url, '_blank')}>
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

const Seat = styled.div<{ $isOccupied: boolean }>`
  padding: 8px;
  background: ${props => props.$isOccupied ? theme.colors.primary : theme.colors.tertiary};
  color: white;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
`;

const SeatLabel = styled.div`
  font-weight: bold;
  font-size: 0.9rem;
`;

const SeatStatus = styled.div`
  font-size: 0.8rem;
  margin-top: 4px;
`;

const ViewMoreText = styled.div`
  text-align: center;
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
  margin-top: 12px;
  cursor: pointer;

  &:hover {
    color: ${theme.colors.text.primary};
  }
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

const DetailButton = styled.button<{ $secondary?: boolean }>`
  flex: 1;
  padding: 10px;
  background: ${props => props.$secondary ? "white" : theme.colors.primary};
  color: ${props => props.$secondary ? theme.colors.primary : "white"};
  border: ${props => props.$secondary ? `1px solid ${theme.colors.primary}` : "none"};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.$secondary ? theme.colors.background : theme.colors.hover};
  }
`;

export default MapPage;
