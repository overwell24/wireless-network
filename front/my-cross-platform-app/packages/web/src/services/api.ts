// src/services/api.ts
import axios from 'axios';
import { Cafe, CafeDetail } from '../types/cafe';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api'
});

export const cafeApi = {
  // 모든 카페 목록 조회
  getCafes: async (): Promise<Cafe[]> => {
    const response = await api.get('/cafes');
    return response.data;
  },

  // 특정 카페 상세 정보 조회
  getCafeDetails: async (cafeId: number): Promise<CafeDetail> => {
    const response = await api.get(`/cafes/${cafeId}`);
    return response.data;
  },

  // 테이블 상태 업데이트 (센서 데이터 전송용)
  updateTableStatus: async (cafeId: number, tableStatus: Record<string, number>) => {
    await api.post('/cafe/table-status', {
      cafe_id: cafeId,
      tables_occupied_status: tableStatus
    });
  }
};