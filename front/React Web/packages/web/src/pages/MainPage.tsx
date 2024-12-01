import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import heroBackground from '../assets/hero-background.jpg';
import {
  FaMapMarkedAlt,
  FaList,
  FaChair,
  FaChartBar,
  FaSearch
} from 'react-icons/fa';
import { User2 } from 'lucide-react'; // Updated import

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <ContentWrapper>
        <HeroSection>
          <Overlay />
          <HeroContent>
            <MainTitle>카페 자리있어?</MainTitle>
            <Subtitle>실시간으로 확인하는 스마트한 카페 좌석 현황</Subtitle>
            <ButtonGroup>
              <MainButton onClick={() => navigate('/map')}>
                <FaMapMarkedAlt />
                지도에서 찾기
              </MainButton>

              <SecondaryButton onClick={() => navigate('/list')}>
                <FaList />
                목록에서 찾기
              </SecondaryButton>
            </ButtonGroup>
          </HeroContent>
        </HeroSection>

        <ServicesSection>
          <SectionTitle>서비스 소개</SectionTitle>
          <ServicesWrapper>
            <ServiceCard>
              <ServiceIcon>
                <FaChair />
              </ServiceIcon>
              <ServiceTitle>실시간 좌석 현황</ServiceTitle>
              <ServiceDescription>
                원하는 카페의 실시간 좌석 상황을 확인하고 바로 예약하세요.
              </ServiceDescription>
            </ServiceCard>

            <ServiceCard>
              <ServiceIcon>
                <FaChartBar />
              </ServiceIcon>
              <ServiceTitle>혼잡도 체크</ServiceTitle>
              <ServiceDescription>
                현재 카페의 혼잡도를 확인하여 여유로운 시간을 계획하세요.
              </ServiceDescription>
            </ServiceCard>

            <ServiceCard>
              <ServiceIcon>
                <FaSearch />
              </ServiceIcon>
              <ServiceTitle>스마트 검색</ServiceTitle>
              <ServiceDescription>
                위치 기반 검색으로 근처의 다양한 카페를 빠르게 찾아보세요.
              </ServiceDescription>
            </ServiceCard>
          </ServicesWrapper>
        </ServicesSection>

        <TestimonialsSection>
          <SectionTitle>사용자 후기</SectionTitle>
          <TestimonialsWrapper>
            <TestimonialCard>
              <UserIconWrapper>
                <User2 size={48} color={theme.colors.primary} />
              </UserIconWrapper>
              <UserName>이태규</UserName>
              <UserReview>
                "카페 자리있어 덕분에 항상 편리하게 카페를 찾을 수 있어요! 실시간 좌석 현황이 정말 유용하고, 사용이 간편해서 자주 이용하고 있습니다."
              </UserReview>
            </TestimonialCard>

            <TestimonialCard>
              <UserIconWrapper>
                <User2 size={48} color={theme.colors.primary} />
              </UserIconWrapper>
              <UserName>나예원</UserName>
              <UserReview>
                "실시간 좌석 현황 덕분에 카페에서 기다리는 시간이 없어졌어요. 혼잡도 체크 기능도 덕분에 평소보다 더 여유롭게 시간을 보낼 수 있었습니다."
              </UserReview>
            </TestimonialCard>

            <TestimonialCard>
              <UserIconWrapper>
                <User2 size={48} color={theme.colors.primary} />
              </UserIconWrapper>
              <UserName>민찬기</UserName>
              <UserReview>
                "스마트 검색 기능이 정말 유용해요. 근처에 새로운 카페를 발견하고 바로 예약까지 할 수 있어서 좋아요."
              </UserReview>
            </TestimonialCard>

            <TestimonialCard>
              <UserIconWrapper>
                <User2 size={48} color={theme.colors.primary} />
              </UserIconWrapper>
              <UserName>박상천</UserName>
              <UserReview>
                "카페 자리있어를 사용한 후로, 카페 선택이 훨씬 쉬워졌어요. 특히, 실시간 업데이트 덕분에 항상 최신 정보를 얻을 수 있어 만족합니다."
              </UserReview>
            </TestimonialCard>
          </TestimonialsWrapper>
        </TestimonialsSection>
      </ContentWrapper>
    </Container>
  );
};

// 애니메이션
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 메인 컨테이너
const Container = styled.div`
  min-height: 170vh;
  background: ${theme.colors.background};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  font-family: ${theme.fonts.primary};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 20px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.mobile}) {
    max-width: 100%;
  }
`;

const HeroSection = styled.section`
  position: relative;
  height: 90vh;
  background: url(${heroBackground}) center center/cover no-repeat;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${theme.shadows.large};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 60vh;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    ${theme.colors.overlayGradientStart},
    ${theme.colors.overlayGradientEnd}
  );
  opacity: 0.4;
  z-index: 1;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  color: ${theme.colors.text.light};
  animation: ${fadeInUp} 1s ease-out;
  padding: 20px;
`;

const MainTitle = styled.h1`
  font-size: 3.5rem;
  color: ${theme.colors.text.light};
  margin-bottom: 20px;
  font-weight: bold;
  letter-spacing: -1px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: ${theme.colors.text.light};
  margin-bottom: 40px;
  font-weight: 300;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

const BaseButton = styled.button`
  padding: 15px 35px;
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
  color: inherit;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.large};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 80%;
    justify-content: center;
  }

  svg {
    font-size: 1.5rem;
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

const ServicesSection = styled.section`
  margin-top: 80px;
  animation: ${fadeInUp} 1s ease-out;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: 40px;
  font-weight: bold;
  animation: ${fadeInUp} 1s ease-out;
`;

const ServicesWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 30px;
  flex-wrap: wrap;
  margin-top: 40px;
`;

const ServiceCard = styled.div`
  background: white;
  padding: 30px 20px;
  border-radius: 16px;
  box-shadow: ${theme.shadows.medium};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  flex: 1 1 250px;
  max-width: 300px;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.large};
  }
`;

const ServiceIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
  color: ${theme.colors.primary};
`;

const ServiceTitle = styled.h3`
  font-size: 1.4rem;
  color: ${theme.colors.primary};
  margin-bottom: 10px;
  font-weight: 600;
`;

const ServiceDescription = styled.p`
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
  font-size: 1rem;
`;

const TestimonialsSection = styled.section`
  margin-top: 60px;
  animation: ${fadeInUp} 1s ease-out;
`;

const TestimonialsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 30px;
  flex-wrap: wrap;
  margin-top: 40px;
`;

const TestimonialCard = styled.div`
  background: white;
  padding: 30px 20px;
  border-radius: 16px;
  box-shadow: ${theme.shadows.medium};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  flex: 1 1 300px;
  max-width: 350px;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.large};
  }
`;

const UserIconWrapper = styled.div`
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UserName = styled.h3`
  font-size: 1.3rem;
  color: ${theme.colors.primary};
  margin-bottom: 10px;
  font-weight: 600;
`;

const UserReview = styled.p`
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
  font-size: 1rem;
`;

export default MainPage;
