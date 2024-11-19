import React, { useState, useEffect } from 'react';
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
  x: string;
  y: string;
  place_url: string;
  is_test?: boolean;
}

// 테스트용 위치 데이터
const TEST_LOCATIONS = [
  {
    id: 'test-1',
    place_name: "4호관 405호",
    category_name: "카페",
    phone: "",
    address_name: "인천광역시 미추홀구 인하로 100 인하공업전문대학 4호관 1층",
    road_address_name: "인천광역시 미추홀구 인하로 100 인하공업전문대학 4호관 1층",
    x: "126.658518",
    y: "37.448201",
    place_url: "#",
    is_test: true,
    tables_occupied_status: {
      table_1: 0,
      table_2: 1,
      table_3: 1,
      table_4: 0,
      table_5: 0,
    }
  }
];

const CafeListPage = () => {
  const [cafes, setCafes] = useState<KakaoPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          searchNearbyCafes(37.448201, 126.658518); // 인하공전 4호관 위치로 고정
        },
        (error) => {
          console.error('위치 정보 가져오기 실패:', error);
          searchNearbyCafes(37.448201, 126.658518); // 인하공전 4호관 위치로 고정
        }
      );
    }
  }, []);

  const searchNearbyCafes = (lat: number, lng: number) => {
    const ps = new window.kakao.maps.services.Places();
    
    ps.categorySearch(
      'CE7',
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          // 실제 카페에 is_test: false 추가
          const realCafes = data.map(cafe => ({
            ...cafe,
            is_test: false
          }));
          
          // 실제 카페와 테스트 위치 합치기
          setCafes([...realCafes, ...TEST_LOCATIONS]);
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
    
    // 실제 카페의 경우 mock 데이터나 랜덤 값 사용
    const mockCafe = mockCafes.find(cafe => cafe.cafe_id.toString() === cafeId);
    if (mockCafe?.tables_occupied_status) {
      const totalTables = Object.keys(mockCafe.tables_occupied_status).length;
      const occupiedTables = Object.values(mockCafe.tables_occupied_status)
        .filter(status => status === 1).length;
      return Math.round((occupiedTables / totalTables) * 100);
    }
    
    return Math.floor(Math.random() * 100);
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
        {cafes.map(cafe => {
          const crowdedness = getCrowdedness(cafe.id);
          return (
            <CafeCard key={cafe.id} isTest={cafe.is_test}>
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
                    width={crowdedness}
                    color={getCrowdednessColor(crowdedness)}
                  />
                </CrowdednessBar>
                <CrowdednessText>
                  혼잡도: {crowdedness}%
                </CrowdednessText>
              </CrowdednessInfo>

              <ButtonGroup>
                <ActionButton 
                  onClick={() => window.location.href = `/cafe/${cafe.id}`}
                >
                  상세정보
                </ActionButton>
                {!cafe.is_test && (
                  <ActionButton 
                    onClick={() => window.open(cafe.place_url, '_blank')}
                    secondary
                  >
                    카카오맵
                  </ActionButton>
                )}
              </ButtonGroup>
            </CafeCard>
          );
        })}
      </CafeList>
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

const CafeCard = styled.div<{ isTest?: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${theme.shadows.medium};
  border: ${props => props.isTest ? `2px solid ${theme.colors.primary}` : 'none'};
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

const ActionButton = styled.button<{ secondary?: boolean }>`
  flex: 1;
  padding: 8px;
  background: ${props => props.secondary ? 'white' : theme.colors.primary};
  color: ${props => props.secondary ? theme.colors.primary : 'white'};
  border: ${props => props.secondary ? `1px solid ${theme.colors.primary}` : 'none'};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.secondary ? theme.colors.background : theme.colors.hover};
  }
`;

export default CafeListPage;