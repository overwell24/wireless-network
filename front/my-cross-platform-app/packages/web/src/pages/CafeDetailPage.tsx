import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Coffee, Users, Clock, ArrowLeft } from 'lucide-react';

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

const CafeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cafeData, setCafeData] = useState<CafeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // API에서 카페 데이터 가져오기
  const fetchCafeData = async () => {
    try {
      const response = await fetch(`http://15.165.161.251/api/cafes`);
      const data = await response.json();
      const targetCafe = data.find((cafe: CafeData) => cafe.cafe_id.toString() === id);
      
      if (targetCafe) {
        setCafeData(targetCafe);
        setLastUpdated(new Date());
      } else {
        setError('카페를 찾을 수 없습니다');
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch cafe details:', error);
      setError('데이터를 불러오는데 실패했습니다');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCafeData();
    // 1분마다 데이터 자동 업데이트
    const interval = setInterval(fetchCafeData, 60000);
    return () => clearInterval(interval);
  }, [id]);

  const calculateCrowdedness = () => {
    if (!cafeData?.table_status) return 0;
    const totalSeats = Object.keys(cafeData.table_status).length;
    const occupiedSeats = Object.values(cafeData.table_status).filter(status => status === 1).length;
    return Math.round((occupiedSeats / totalSeats) * 100);
  };

  const getCrowdednessColor = (percentage: number) => {
    if (percentage >= 80) return theme.colors.primary;
    if (percentage >= 50) return theme.colors.secondary;
    return theme.colors.tertiary;
  };

  const getTimeAgo = () => {
    const diff = new Date().getTime() - lastUpdated.getTime();
    const minutes = Math.floor(diff / 60000);
    return minutes === 0 ? '방금 전' : `${minutes}분 전`;
  };

  if (loading) return <LoadingSpinner>데이터를 불러오는 중...</LoadingSpinner>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!cafeData) return <ErrorMessage>카페 정보를 찾을 수 없습니다</ErrorMessage>;

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          뒤로 가기
        </BackButton>
        <HeaderContent>
          <Title>{cafeData.cafe_name}</Title>
          <Address>{cafeData.cafe_address}</Address>
        </HeaderContent>
      </Header>

      <StatusBar>
        <StatusItem>
          <StatusIcon>
            <Users size={20} />
          </StatusIcon>
          <StatusText>
            <StatusLabel>현재 혼잡도</StatusLabel>
            <StatusValue color={getCrowdednessColor(calculateCrowdedness())}>
              {calculateCrowdedness()}%
            </StatusValue>
          </StatusText>
        </StatusItem>

        <StatusItem>
          <StatusIcon>
            <Coffee size={20} />
          </StatusIcon>
          <StatusText>
            <StatusLabel>이용 가능 좌석</StatusLabel>
            <StatusValue>
              {Object.values(cafeData.table_status).filter(status => status === 0).length}석
            </StatusValue>
          </StatusText>
        </StatusItem>

        <StatusItem>
          <StatusIcon>
            <Clock size={20} />
          </StatusIcon>
          <StatusText>
            <StatusLabel>마지막 업데이트</StatusLabel>
            <StatusValue>{getTimeAgo()}</StatusValue>
          </StatusText>
        </StatusItem>
      </StatusBar>

      <SeatMapContainer>
        <SeatMapTitle>좌석 배치도</SeatMapTitle>
        <SeatGrid>
          {Object.entries(cafeData.table_status).map(([seatId, isOccupied]) => (
            <Seat
              key={seatId}
              $isOccupied={isOccupied === 1}
            >
              <SeatLabel>{seatId}</SeatLabel>
              <SeatStatus>
                {isOccupied === 1 ? '사용중' : '이용 가능'}
              </SeatStatus>
            </Seat>
          ))}
        </SeatGrid>
      </SeatMapContainer>

      <Legend>
        <LegendItem>
          <LegendColor isOccupied={false} />
          <span>이용 가능</span>
        </LegendItem>
        <LegendItem>
          <LegendColor isOccupied={true} />
          <span>사용중</span>
        </LegendItem>
      </Legend>

      {!cafeData.is_test && cafeData.place_url && (
        <KakaoMapButton onClick={() => window.open(cafeData.place_url, '_blank')}>
          카카오맵에서 보기
        </KakaoMapButton>
      )}

      <UpdateInfo>
        * 좌석 정보는 1분마다 자동으로 업데이트됩니다
      </UpdateInfo>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: 8px;
  margin-bottom: 16px;
  border-radius: 8px;

  &:hover {
    background: ${theme.colors.background};
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${theme.colors.text.primary};
`;

const Address = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 1rem;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: ${theme.colors.text.secondary};
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: #ff6b6b;
  color: white;
  border-radius: 8px;
  text-align: center;
`;

const StatusBar = styled.div`
  display: flex;
  gap: 32px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: ${theme.shadows.medium};
  margin-bottom: 32px;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${theme.colors.background};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.secondary};
`;

const StatusText = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatusLabel = styled.span`
  font-size: 0.9rem;
  color: ${theme.colors.text.secondary};
`;

const StatusValue = styled.span<{ color?: string }>`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.color || theme.colors.text.primary};
`;

const SeatMapContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${theme.shadows.medium};
  margin-bottom: 20px;
`;

const SeatMapTitle = styled.h2`
  font-size: 1.5rem;
  color: ${theme.colors.text.primary};
  margin-bottom: 24px;
`;

const SeatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  padding: 20px;
  background: ${theme.colors.background};
  border-radius: 8px;
`;

const Seat = styled.div<{ $isOccupied: boolean }>`
  aspect-ratio: 1;
  background: ${props => props.$isOccupied ? theme.colors.primary : theme.colors.tertiary};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  cursor: default;

  &:hover {
    transform: scale(1.05);
  }
`;

const SeatLabel = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 4px;
`;

const SeatStatus = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin: 20px 0;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.text.secondary};
`;

const LegendColor = styled.div<{ isOccupied: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: ${props => props.isOccupied ? theme.colors.primary : theme.colors.tertiary};
`;

const KakaoMapButton = styled.button`
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 24px auto;
  padding: 12px;
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

const UpdateInfo = styled.div`
  text-align: center;
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
  margin-top: 16px;
`;

export default CafeDetailPage;