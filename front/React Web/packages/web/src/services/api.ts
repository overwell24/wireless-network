// api.ts
import axios from "axios";

// API 응답 타입 정의
export interface Cafe {
  cafe_id: number;
  cafe_name: string;
  cafe_address: string;
  lat: string;
  lng: string;
  phone?: string;
  place_url?: string;
  table_status: TableStatus;
}

export interface TableStatus {
  [key: string]: number; // 0: 비어있음, 1: 사용중
}

export interface TableStatusUpdate {
  cafe_id: number;
  tables_occupied_status: TableStatus;
}

// API 인스턴스 생성
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://15.165.161.251/api",
  timeout: 10000, // 10초로 증가
});

// 필요 시 요청 인터셉터를 추가하여 인증 헤더 포함
// 예를 들어, JWT 토큰을 사용하는 경우:
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // 토큰 저장 방식에 따라 변경
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API 메서드 정의
export const cafeApi = {
  // 모든 카페 정보 조회
  getCafes: async (): Promise<Cafe[]> => {
    try {
      console.log("Fetching cafes...");
      const response = await api.get<Cafe[]>("/cafes");
      console.log("Fetched cafes:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch cafes:", error);
      throw error;
    }
  },

  // 특정 카페의 테이블 상태 조회
  getCafeDetails: async (cafeId: number): Promise<TableStatus> => {
    try {
      console.log(`Fetching details for cafeId: ${cafeId}`);
      const response = await api.get<TableStatus>(`/cafes/${cafeId}/tables`);
      console.log("Fetched cafe details:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Failed to fetch cafe details for cafeId ${cafeId}:`, error);
      throw error;
    }
  },

  // 테이블 상태 업데이트
  updateTableStatus: async (cafeId: number, tableStatus: TableStatus): Promise<void> => {
    try {
      console.log(`Updating table status for cafeId: ${cafeId}`);
      console.log("Table status data:", tableStatus);
      
      const updateData: TableStatusUpdate = {
        cafe_id: cafeId,
        tables_occupied_status: tableStatus,
      };

      await api.post("/cafe/table-status", updateData);
      console.log("Table status updated successfully");
    } catch (error: any) {
      console.error(`Failed to update table status for cafeId ${cafeId}:`, error);
      throw error;
    }
  },
};
