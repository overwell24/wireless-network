// src/pages/CafeDetailPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';

interface Seat {
  id: string;
  x: number;
  y: number;
  isOccupied: boolean;
}

// 더미 데이터: 4호관 405호의 좌석 배치
const DUMMY_SEATS: Seat[] = [
  { id: 'table_1', x: 20, y: 20, isOccupied: false },
  { id: 'table_2', x: 100, y: 20, isOccupied: true },
  { id: 'table_3', x: 180, y: 20, isOccupied: true },
  { id: 'table_4', x: 20, y: 100, isOccupied: false },
  { id: 'table_5', x: 100, y: 100, isOccupied: false },
  // 필요한 만큼 좌석 추가
];

const CafeDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // 혼잡도 계산
  const calculateCrowdedness = () => {
    const occupiedSeats = DUMMY_SEATS.filter(seat => seat.isOccupied).length;
    return Math.round((occupiedSeats / DUMMY_SEATS.length) * 100);
  };

  return (
    <Container>
      <Header>
        <Title>4호관 405호</Title>
        <CrowdednessIndicator>
          현재 혼잡도: {calculateCrowdedness()}%
        </CrowdednessIndicator>
      </Header>

      <SeatMapContainer>
        <MapTitle>좌석 배치도</MapTitle>
        <SeatMap>
          {DUMMY_SEATS.map(seat => (
            <Seat
              key={seat.id}
              style={{
                left: `${seat.x}px`,
                top: `${seat.y}px`
              }}
              isOccupied={seat.isOccupied}
            >
              <SeatLabel>{seat.id}</SeatLabel>
              <SeatStatus>{seat.isOccupied ? '사용중' : '빈좌석'}</SeatStatus>
            </Seat>
          ))}
        </SeatMap>
      </SeatMapContainer>

      <Legend>
        <LegendItem>
          <LegendColor isOccupied={false} />
          <span>빈좌석</span>
        </LegendItem>
        <LegendItem>
          <LegendColor isOccupied={true} />
          <span>사용중</span>
        </LegendItem>
      </Legend>
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

const Seat = styled.div<{ isOccupied: boolean }>`
  position: absolute;
  width: 60px;
  height: 60px;
  background: ${props => props.isOccupied ? theme.colors.primary : theme.colors.tertiary};
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