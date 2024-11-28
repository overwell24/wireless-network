// src/pages/CafeDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { cafeApi } from '../services/api';
import { theme } from '../styles/theme';


interface Seat {
  id: string;
  isOccupied: boolean;
}

const CafeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [seats, setSeats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // API에서 좌석 데이터 가져오기
  useEffect(() => {
    const fetchCafeDetails = async () => {
      try {
        const data = await cafeApi.getCafeDetails(Number(id)); // 반환값은 Record<string, number>
        console.log('API Data:', data); // 데이터 확인
        setSeats(data); // 좌석 상태로 설정
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch cafe details:', error);
        setSeats({}); // 기본값으로 빈 객체 설정
        setLoading(false);
      }
    };
  
    fetchCafeDetails();
  }, [id]);
  

  // 혼잡도 계산
  const calculateCrowdedness = () => {
    if (Object.keys(seats).length === 0) return 0; // 좌석 데이터가 없으면 혼잡도 0%
    const occupiedSeats = Object.values(seats).filter(status => status === 1).length;
    return Math.round((occupiedSeats / Object.keys(seats).length) * 100);
  };
  

  return (
    <Container>
      {loading ? (
        <div>로딩 중...</div>
      ) : (
        <>
          <Header>
            <Title>카페 상세정보</Title>
            <CrowdednessIndicator>
              현재 혼잡도: {calculateCrowdedness()}%
            </CrowdednessIndicator>
          </Header>

          <SeatMapContainer>
            <MapTitle>좌석 배치도</MapTitle>
            <SeatMap>
              {Object.entries(seats).map(([seatId, isOccupied]) => (
                <Seat
                  key={seatId}
                  $isOccupied={isOccupied === 1}
                >
                  <SeatLabel>{seatId}</SeatLabel>
                  <SeatStatus>{isOccupied === 1 ? '사용중' : '빈좌석'}</SeatStatus>
                </Seat>
              ))}
            </SeatMap>
          </SeatMapContainer>
        </>
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
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${theme.colors.text.primary};
  margin-bottom: 10px;
`;

const CrowdednessIndicator = styled.div`
  font-size: 1.2rem;
  color: ${theme.colors.text.secondary};
`;

const SeatMapContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${theme.shadows.medium};
  margin-bottom: 20px;
`;

const MapTitle = styled.h2`
  font-size: 1.5rem;
  color: ${theme.colors.text.primary};
  margin-bottom: 20px;
`;

const SeatMap = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  border: 1px solid ${theme.colors.background};
  border-radius: 8px;
  margin: 20px 0;
`;

const Seat = styled.div<{ $isOccupied: boolean }>`
  position: absolute;
  width: 60px;
  height: 60px;
  background: ${props => props.$isOccupied ? theme.colors.primary : theme.colors.tertiary};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const SeatLabel = styled.div`
  font-weight: bold;
  font-size: 0.9rem;
`;

const SeatStatus = styled.div`
  font-size: 0.8rem;
  margin-top: 4px;
`;

const Legend = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LegendColor = styled.div<{ isOccupied: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: ${props => props.isOccupied ? theme.colors.primary : theme.colors.tertiary};
`;

export default CafeDetailPage;
