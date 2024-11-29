import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
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

const CafeListPage = () => {
  const navigate = useNavigate();
  const [cafes, setCafes] = useState<KakaoPlace[]>([]);
  const [kakaoPlaces, setKakaoPlaces] = useState<KakaoPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [center] = useState({ lat: 37.448258, lng: 126.658601 });

  // 좌석 상태를 랜덤으로 생성하는 함수
  const generateDummySeats = (cafeId: string): TableStatus => {
    const numberOfTables = Math.floor(Math.random() * 6) + 5; // 5~10개의 테이블
    const tableStatus: TableStatus = {};

    for (let i = 1; i <= numberOfTables; i++) {
      tableStatus[`table_${i}`] = Math.random() < 0.6 ? 0 : 1; // 60% 확률로 빈자리
    }

    return tableStatus;
  };

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
                  onClick={() => navigate(`/cafe/${cafe.id}`)}
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

export default CafeListPage;
