import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

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

// 좌석 레이아웃 컴포넌트
const SeatLayout = ({ tableStatus }: { tableStatus: TableStatus }) => {
  return (
    <SeatContainer>
      <SeatTitle>좌석 배치도</SeatTitle>
      <SeatGrid>
        {Object.entries(tableStatus).map(([seatId, isOccupied]) => (
          <Seat key={seatId} $isOccupied={isOccupied === 1}>
            <SeatLabel>{seatId}</SeatLabel>
            <SeatStatus>{isOccupied === 1 ? '사용중' : '빈좌석'}</SeatStatus>
          </Seat>
        ))}
      </SeatGrid>
    </SeatContainer>
  );
};

// 상세 정보 모달 컴포넌트
const CafeDetailModal = ({ cafe, onClose }: { cafe: KakaoPlace; onClose: () => void }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <CafeName>{cafe.place_name}</CafeName>
        <AddressText>{cafe.road_address_name || cafe.address_name}</AddressText>
        {cafe.table_status && <SeatLayout tableStatus={cafe.table_status} />}
      </ModalContent>
    </ModalOverlay>
  );
};

const CafeListPage = () => {
  const [cafes, setCafes] = useState<KakaoPlace[]>([]);
  const [kakaoPlaces, setKakaoPlaces] = useState<KakaoPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [center] = useState({ lat: 37.448258, lng: 126.658601 });
  const [selectedCafe, setSelectedCafe] = useState<KakaoPlace | null>(null);

  // 좌석 상태를 랜덤으로 생성하는 함수
  const generateDummySeats = (cafeId: string): TableStatus => {
    const numberOfTables = Math.floor(Math.random() * 6) + 5;
    const tableStatus: TableStatus = {};

    for (let i = 1; i <= numberOfTables; i++) {
      tableStatus[`table_${i}`] = Math.random() < 0.6 ? 0 : 1;
    }

    return tableStatus;
  };

  // 카카오 Places 서비스 초기화
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
    fetchCafes();
    searchNearbyCafes(center.lat, center.lng);
  }, [center.lat, center.lng]);

  // 혼잡도 계산
  const getCrowdedness = (cafeId: string) => {
    const cafe = [...cafes, ...kakaoPlaces].find((cafe) => cafe.id === cafeId);
    if (!cafe || !cafe.table_status) return 0;

    const totalTables = Object.keys(cafe.table_status).length;
    const occupiedTables = Object.values(cafe.table_status).filter((status) => status === 1).length;
    return Math.round((occupiedTables / totalTables) * 100);
  };

  const getCrowdednessColor = (crowdedness: number) => {
    if (crowdedness >= 80) return theme.colors.primary;
    if (crowdedness >= 50) return theme.colors.secondary;
    return theme.colors.tertiary;
  };

  return (
    <Container>
      <Header>
        <Title>주변 카페 목록</Title>
      </Header>

      {loading && <LoadingSpinner>로딩 중...</LoadingSpinner>}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <CafeList>
        {[...cafes, ...kakaoPlaces].map(cafe => {
          const crowdedness = getCrowdedness(cafe.id);
          return (
            <CafeCard key={cafe.id} $isTest={cafe.is_test}>
              <CafeInfo>
                <CafeName>{cafe.place_name}</CafeName>
                <AddressText>
                  {cafe.road_address_name || cafe.address_name}
                </AddressText>
                {cafe.phone && <PhoneText>{cafe.phone}</PhoneText>}
              </CafeInfo>
              
              <CrowdednessInfo>
                <CrowdednessBar>
                  <CrowdednessProgress 
                    width={getCrowdedness(cafe.id)}
                    color={getCrowdednessColor(getCrowdedness(cafe.id))}
                  />
                </CrowdednessBar>
                <CrowdednessText>
                  혼잡도: {getCrowdedness(cafe.id)}%
                </CrowdednessText>
              </CrowdednessInfo>

              <ButtonGroup>
                <ActionButton 
                  onClick={() => setSelectedCafe(cafe)}
                >
                  상세정보
                </ActionButton>
                {!cafe.is_test && (
                  <ActionButton 
                    onClick={() => window.open(cafe.place_url, '_blank')}
                    $secondary
                  >
                    카카오맵
                  </ActionButton>
                )}
              </ButtonGroup>
            </CafeCard>
          );
        })}
      </CafeList>

      {selectedCafe && (
        <CafeDetailModal 
          cafe={selectedCafe} 
          onClose={() => setSelectedCafe(null)}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: ${theme.colors.text.primary};
  font-size: 2rem;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: ${theme.colors.primary};
`;

const ErrorMessage = styled.div`
  background: #ff6b6b;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const CafeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CafeCard = styled.div<{ $isTest?: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${theme.shadows.medium};
  border: ${({ $isTest }) => ($isTest ? `2px solid ${theme.colors.primary}` : "none")};
`;

const CafeInfo = styled.div`
  margin-bottom: 16px;
`;

const CafeName = styled.h2`
  color: ${theme.colors.text.primary};
  font-size: 1.25rem;
  margin-bottom: 8px;
`;

const AddressText = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
  margin-bottom: 4px;
`;

const PhoneText = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const CrowdednessInfo = styled.div`
  margin-bottom: 16px;
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

const CrowdednessText = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ $secondary?: boolean }>`
  flex: 1;
  padding: 8px;
  background: ${({ $secondary }) => ($secondary ? "white" : theme.colors.primary)};
  color: ${({ $secondary }) => ($secondary ? theme.colors.primary : "white")};
  border: ${({ $secondary }) => ($secondary ? `1px solid ${theme.colors.primary}` : "none")};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $secondary }) =>
      $secondary ? theme.colors.background : theme.colors.hover};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
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

const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${theme.colors.text.secondary};
  padding: 5px;
  line-height: 1;
  
  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

export default CafeListPage;