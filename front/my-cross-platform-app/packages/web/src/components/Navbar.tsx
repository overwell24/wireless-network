// src/components/Navbar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  if (location.pathname === '/') return null;

  return (
    <Nav>
      <NavLogo onClick={() => navigate('/')}>
        <LogoIcon>☕️</LogoIcon>
        <LogoText>카페 자리있어?</LogoText>
      </NavLogo>
      <NavItems>
        <NavItem onClick={() => navigate('/map')} active={location.pathname === '/map'}>
          지도로 보기
        </NavItem>
        <NavItem onClick={() => navigate('/list')} active={location.pathname === '/list'}>
          목록으로 보기
        </NavItem>
      </NavItems>
    </Nav>
  );
};

const Nav = styled.nav`
  background: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${theme.shadows.small};
  border-bottom: 1px solid ${theme.colors.tertiary}30;
`;

const NavLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const LogoIcon = styled.span`
  font-size: 1.8rem;
`;

const LogoText = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${theme.colors.primary};
`;

const NavItems = styled.div`
  display: flex;
  gap: 20px;
`;

const NavItem = styled.div<{ active?: boolean }>`
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  color: ${props => props.active ? theme.colors.primary : theme.colors.text.secondary};
  font-weight: ${props => props.active ? '600' : '400'};
  background: ${props => props.active ? theme.colors.tertiary + '30' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${theme.colors.tertiary + '50'};
    color: ${theme.colors.primary};
  }
`;

export default Navbar;