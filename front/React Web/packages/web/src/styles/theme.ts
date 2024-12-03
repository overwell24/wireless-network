// src/styles/theme.ts
export const theme = {
  colors: {
    primary: '#6B4423',     // 진한 브라운 (메인 강조색)
    secondary: '#967259',   // 중간 브라운 (보조 강조색)
    tertiary: '#DBC1AC',    // 연한 브라운 (포인트 색상)
    background: '#FDF6EC',  // 아이보리 (배경색)
    text: {
      primary: '#2C1810',    // 진한 브라운 (주요 텍스트)
      secondary: '#785942',  // 중간 브라운 (보조 텍스트)
      light: '#FDF6EC',      // 밝은 색 (밝은 배경의 텍스트)
    },
    accent: '#C77D4F',       // 따뜻한 브라운 (강조색)
    hover: '#8B573C',        // 호버 상태 색상
    footerBackground: '#6B4423', // 진한 브라운 (푸터 배경색)
    overlayGradientStart: 'rgba(107, 68, 35, 0.8)', // primary color with opacity
    overlayGradientEnd: 'rgba(150, 114, 89, 0.8)',   // secondary color with opacity
    border: '#e0e0e0',
  },
  shadows: {
    small: '0 2px 4px rgba(43, 24, 16, 0.1)',
    medium: '0 4px 6px rgba(43, 24, 16, 0.15)',
    large: '0 6px 12px rgba(43, 24, 16, 0.2)',
  },
  fonts: {
    primary: '"Noto Sans KR", sans-serif', // Example font, adjust as needed
  },
  breakpoints: {
    mobile: '768px',
  },
};
