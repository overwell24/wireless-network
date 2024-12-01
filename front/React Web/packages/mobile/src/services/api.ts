// src/services/api.ts

import axios from 'axios';
import Config from 'react-native-config';

// 타입 정의
export interface Cafe {
  cafe_id: number;
  cafe_name: string;
  cafe_address: string;
  phone: string;
  lat: string;
  lng: string;
  place_url: string;
  table_status: TableStatus;
}

export interface TableStatus {
  [key: string]: number; // 0: 비어있음, 1: 사용중
}

export interface CafeDetail extends Cafe {
  is_test?: boolean;
}

// API 설정
const api = axios.create({
  baseURL: Config.API_URL || 'http://15.165.161.251/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  async (config) => {
    // 여기에 토큰 추가 등의 로직 추가 가능
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 에러 처리 로직
    if (error.response) {
      // 서버 응답이 있는 경우
      console.error('API Error Response:', error.response.data);
      switch (error.response.status) {
        case 401:
          // 인증 에러 처리
          break;
        case 404:
          // Not Found 에러 처리
          break;
        default:
          // 기타 에러 처리
          break;
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error('API Request Error:', error.request);
    } else {
      // 요청 설정 중 에러가 발생한 경우
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API 함수들
export const cafeApi = {
  // 모든 카페 목록 조회
  getCafes: async (): Promise<Cafe[]> => {
    try {
      const response = await api.get<Cafe[]>('/cafes');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cafes:', error);
      throw error;
    }
  },

  // 특정 카페 상세 정보 조회
  getCafeDetails: async (cafeId: number): Promise<CafeDetail> => {
    try {
      const response = await api.get<CafeDetail>(`/cafes/${cafeId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch cafe details for cafeId ${cafeId}:`, error);
      throw error;
    }
  },

  // 테이블 상태 업데이트
  updateTableStatus: async (
    cafeId: number,
    tableStatus: TableStatus
  ): Promise<void> => {
    try {
      await api.post('/cafe/table-status', {
        cafe_id: cafeId,
        tables_occupied_status: tableStatus,
      });
    } catch (error) {
      console.error(`Failed to update table status for cafeId ${cafeId}:`, error);
      throw error;
    }
  },

  // 네트워크 연결 상태 확인
  checkConnection: async (): Promise<boolean> => {
    try {
      await api.get('/health');
      return true;
    } catch (error) {
      console.error('Network connection check failed:', error);
      return false;
    }
  },
};

export default api;