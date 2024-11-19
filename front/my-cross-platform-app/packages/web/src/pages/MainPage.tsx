// src/pages/MainPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import heroBackground from '../assets/hero-background.jpg'; // 고해상도 배경 이미지 사용 권장

// React Icons import
import { 
  FaMapMarkedAlt, 
  FaList, 
  FaChair, 
  FaChartBar, 
  FaSearch 
} from 'react-icons/fa';

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

        {/* 서비스 소개 섹션 */}
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

        {/* 사용자 후기 섹션 */}
        <TestimonialsSection>
          <SectionTitle>사용자 후기</SectionTitle>
          <TestimonialsWrapper>
            <TestimonialCard>
              <UserPhoto src="/assets/user1.jpg" alt="홍길동" />
              <UserName>홍길동</UserName>
              <UserReview>
                "카페 자리있어 덕분에 항상 편리하게 카페를 찾을 수 있어요! 정말 추천합니다."
              </UserReview>
            </TestimonialCard>

            <TestimonialCard>
              <UserPhoto src="/assets/user2.jpg" alt="김영희" />
              <UserName>김영희</UserName>
              <UserReview>
                "실시간 좌석 현황 덕분에 카페에서 기다리는 시간이 없어졌어요. 너무 좋아요!"
              </UserReview>
            </TestimonialCard>

            <TestimonialCard>
              <UserPhoto src="/assets/user3.jpg" alt="이철수" />
              <UserName>이철수</UserName>
              <UserReview>
                "스마트 검색 기능이 정말 유용해요. 근처에 좋은 카페를 쉽게 찾을 수 있어요."
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
  padding: 40px; /* 패딩 증가 */
  font-family: ${theme.fonts.primary};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 20px; /* 모바일에서는 패딩 줄이기 */
  }
`;

// 콘텐츠 래퍼
const ContentWrapper = styled.div`
  max-width: 1600px; /* 최대 너비 증가 */
  width: 100%;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.mobile}) {
    max-width: 100%; /* 모바일에서는 최대 너비 100% */
  }
`;

// 히어로 섹션
const HeroSection = styled.section`
  position: relative;
  height: 90vh; /* 높이 증가 */
  background: url(${heroBackground}) center center/cover no-repeat;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${theme.shadows.large};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 60vh; /* 모바일에서는 높이 약간 줄이기 */
  }
`;

// 오버레이
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 오버레이 그라데이션 색상 사용 */
  background: linear-gradient(
    135deg,
    ${theme.colors.overlayGradientStart},
    ${theme.colors.overlayGradientEnd}
  );
  opacity: 0.4; /* 불투명도 낮추어 배경 이미지 선명도 증가 */
  z-index: 1;
`;

// 히어로 콘텐츠
const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  color: ${theme.colors.text.light};
  animation: ${fadeInUp} 1s ease-out;
  padding: 20px;
`;

// 메인 타이틀
const MainTitle = styled.h1`
  font-size: 3.5rem; /* 글씨 크기 약간 증가 */
  color: ${theme.colors.text.light};
  margin-bottom: 20px;
  font-weight: bold;
  letter-spacing: -1px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

// 서브타이틀
const Subtitle = styled.p`
  font-size: 1.5rem; /* 글씨 크기 약간 증가 */
  color: ${theme.colors.text.light};
  margin-bottom: 40px;
  font-weight: 300;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.2rem;
  }
`;

// 버튼 그룹
const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

// 기본 버튼 스타일
const BaseButton = styled.button`
  padding: 15px 35px; /* 패딩 약간 증가 */
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

// 메인 버튼
const MainButton = styled(BaseButton)`
  background: ${theme.colors.primary};
  color: ${theme.colors.text.light};

  &:hover {
    background: ${theme.colors.hover};
  }
`;

// 서브 버튼
const SecondaryButton = styled(BaseButton)`
  background: ${theme.colors.tertiary};
  color: ${theme.colors.primary};

  &:hover {
    background: ${theme.colors.secondary};
    color: ${theme.colors.text.light};
  }
`;

// 서비스 소개 섹션
const ServicesSection = styled.section`
  margin-top: 80px;
  animation: ${fadeInUp} 1s ease-out;
`;

// 서비스 소개 섹션 제목
const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: 40px;
  font-weight: bold;
  animation: ${fadeInUp} 1s ease-out;
`;

// 서비스 소개 래퍼
const ServicesWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 30px;
  flex-wrap: wrap;
  margin-top: 40px;
`;

// 개별 서비스 카드
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

// 서비스 아이콘
const ServiceIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
  color: ${theme.colors.primary};
`;

// 서비스 제목
const ServiceTitle = styled.h3`
  font-size: 1.4rem;
  color: ${theme.colors.primary};
  margin-bottom: 10px;
  font-weight: 600;
`;

// 서비스 설명
const ServiceDescription = styled.p`
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
  font-size: 1rem;
`;

// 사용자 후기 섹션
const TestimonialsSection = styled.section`
  margin-top: 60px;
  animation: ${fadeInUp} 1s ease-out;
`;

// 사용자 후기 섹션 제목
const TestimonialsSectionTitle = styled.h2`
  font-size: 2rem;
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: 40px;
  font-weight: bold;
  animation: ${fadeInUp} 1s ease-out;
`;

// 사용자 후기 래퍼
const TestimonialsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 30px;
  flex-wrap: wrap;
  margin-top: 40px;
`;

// 개별 후기 카드
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

// 사용자 사진
const UserPhoto = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
`;

// 사용자 이름
const UserName = styled.h3`
  font-size: 1.3rem;
  color: ${theme.colors.primary};
  margin-bottom: 10px;
  font-weight: 600;
`;

// 사용자 후기 내용
const UserReview = styled.p`
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
  font-size: 1rem;
`;

export default MainPage;
