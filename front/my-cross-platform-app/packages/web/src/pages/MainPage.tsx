// src/pages/MainPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <ContentWrapper>
        <HeroSection>
          <MainTitle>카페 자리있어?</MainTitle>
          <Subtitle>실시간으로 확인하는 스마트한 카페 좌석 현황</Subtitle>
          
          <ButtonGroup>
            <MainButton onClick={() => navigate('/map')}>
              지도에서 찾기
              <ButtonIcon>🗺️</ButtonIcon>
            </MainButton>
            
            <SecondaryButton onClick={() => navigate('/list')}>
              목록에서 찾기
              <ButtonIcon>📋</ButtonIcon>
            </SecondaryButton>
          </ButtonGroup>
        </HeroSection>

        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>☕️</FeatureIcon>
            <FeatureTitle>실시간 좌석</FeatureTitle>
            <FeatureDescription>
              원하는 카페의 실시간 좌석 현황을 한눈에 확인하세요
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>혼잡도 체크</FeatureTitle>
            <FeatureDescription>
              실시간 혼잡도로 여유로운 카페 시간을 계획하세요
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>스마트 검색</FeatureTitle>
            <FeatureDescription>
              내 주변 카페를 빠르고 스마트하게 찾아보세요
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  text-align: center;
  padding: 40px 20px;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.secondary}20);
  padding: 60px 40px;
  border-radius: 20px;
  margin-bottom: 60px;
  box-shadow: ${theme.shadows.large};
`;

const MainTitle = styled.h1`
  font-size: 4rem;
  color: ${theme.colors.primary};
  margin-bottom: 20px;
  font-weight: bold;
  letter-spacing: -1px;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: ${theme.colors.text.secondary};
  margin-bottom: 40px;
  font-weight: 300;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const BaseButton = styled.button`
  padding: 15px 30px;
  font-size: 1.2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: ${theme.shadows.medium};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.large};
  }
`;

const MainButton = styled(BaseButton)`
  background: ${theme.colors.primary};
  color: ${theme.colors.text.light};

  &:hover {
    background: ${theme.colors.hover};
  }
`;

const SecondaryButton = styled(BaseButton)`
  background: ${theme.colors.tertiary};
  color: ${theme.colors.primary};

  &:hover {
    background: ${theme.colors.secondary};
    color: ${theme.colors.text.light};
  }
`;

const ButtonIcon = styled.span`
  font-size: 1.4rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: ${theme.shadows.medium};
  transition: all 0.3s ease;
  border: 1px solid ${theme.colors.tertiary}30;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.large};
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.6rem;
  color: ${theme.colors.primary};
  margin-bottom: 15px;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
  font-size: 1.1rem;
`;

export default MainPage;