// src/pages/CafeListPage.tsx
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
}

const CafeListPage = () => {
  const [cafes, setCafes] = useState<KakaoPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          searchNearbyCafes(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('위치 정보 가져오기 실패:', error);
          // 기본 위치(강남역)로 검색
          searchNearbyCafes(37.498095, 127.027610);
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
          setCafes(data);
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

  // 더미 데이터에서 혼잡도 가져오기
  const getCrowdedness = (cafeId: string) => {
    const mockCafe = mockCafes.find(cafe => cafe.cafe_id.toString() === cafeId);
    if (!mockCafe?.tables_occupied_status) return 0;
    
    const totalTables = Object.keys(mockCafe.tables_occupied_status).length;
    const occupiedTables = Object.values(mockCafe.tables_occupied_status)
      .filter(status => status === 1).length;
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
        {cafes.map(cafe => {
          const crowdedness = getCrowdedness(cafe.id);
          return (
            <CafeCard key={cafe.id}>
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
                <ActionButton 
                  onClick={() => window.open(cafe.place_url, '_blank')}
                  secondary
                >
                  카카오맵
                </ActionButton>
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

const CafeCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${theme.shadows.medium};
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