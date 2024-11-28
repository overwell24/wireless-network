import axios from "axios";
import { Cafe, CafeDetail } from "../types/cafe";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://15.165.161.251/api", // 기본 URL
  timeout: 5000, // 요청 제한 시간 추가
});

// 예시 API 호출
api.get('/cafes') // 실제 엔드포인트 '/cafes' 추가
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('API 호출 실패:', error);
  });

export const cafeApi = {
  // 모든 카페 가져오기 API
  getCafes: async (): Promise<Cafe[]> => {
    try {
      console.log("Fetching cafes..."); // API 호출 로그 추가
      const response = await api.get("/cafes");
      console.log("Fetched cafes:", response.data); // 응답 로그 추가
      return response.data;
    } catch (error) {
      console.error("Failed to fetch cafes:", error);
      throw error;
    }
  },

  // 특정 카페 좌석 상태 가져오기 API
  getCafeDetails: async (cafeId: number): Promise<Record<string, number>> => {
    try {
      console.log(`Fetching details for cafeId: ${cafeId}`); // 로그 추가
      const response = await api.get(`/cafes/${cafeId}/tables`);
      console.log("Fetched cafe details:", response.data); // 응답 로그 추가
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch cafe details for cafeId ${cafeId}:`, error);
      throw error;
    }
  },

  // 센서 데이터 전송 API
  updateTableStatus: async (
    cafeId: number,
    tableStatus: Record<string, number>
  ): Promise<void> => {
    try {
      console.log(`Updating table status for cafeId: ${cafeId}`); // 로그 추가
      console.log("Table status data:", tableStatus); // 데이터 확인 로그
      await api.post("/cafe/table-status", {
        cafe_id: cafeId,
        tables_occupied_status: tableStatus,
      });
      console.log("Table status updated successfully"); // 성공 로그
    } catch (error) {
      console.error(`Failed to update table status for cafeId ${cafeId}:`, error);
      throw error;
    }
  },
};

