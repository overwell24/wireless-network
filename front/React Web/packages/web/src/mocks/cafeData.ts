// src/mocks/cafeData.ts
import { Cafe, CafeDetail } from '../types/cafe';

export const mockCafes: Cafe[] = [
 {
   cafe_id: 1,
   cafe_name: "스타벅스 강남점",
   lat: 37.498095,
   lng: 127.027610,
   tables_occupied_status: {
     table_1: 0,
     table_2: 1,
     table_3: 1,
     table_4: 0,
     table_5: 1,
     table_6: 0,
     table_7: 0,
     table_8: 1,
     table_9: 0,
     table_10: 1
   }
 },
 {
   cafe_id: 2,
   cafe_name: "투썸플레이스 강남역점",
   lat: 37.497124,
   lng: 127.028364,
   tables_occupied_status: {
     table_1: 0,
     table_2: 0,
     table_3: 1,
     table_4: 1,
     table_5: 0,
     table_6: 1,
     table_7: 0,
     table_8: 0,
     table_9: 1,
     table_10: 0
   }
 },
 {
   cafe_id: 3,
   cafe_name: "블루보틀 강남점",
   lat: 37.499447,
   lng: 127.029054,
   tables_occupied_status: {
     table_1: 1,
     table_2: 1,
     table_3: 1,
     table_4: 0,
     table_5: 1,
     table_6: 1,
     table_7: 1,
     table_8: 0,
     table_9: 1,
     table_10: 1
   }
 },
 {
   cafe_id: 4,
   cafe_name: "폴 바셋 강남",
   lat: 37.496185,
   lng: 127.026878,
   tables_occupied_status: {
     table_1: 0,
     table_2: 0,
     table_3: 0,
     table_4: 1,
     table_5: 0,
     table_6: 0,
     table_7: 1,
     table_8: 0,
     table_9: 0,
     table_10: 0
   }
 },
 {
   cafe_id: 5,
   cafe_name: "커피빈 강남역점",
   lat: 37.497756,
   lng: 127.029480,
   tables_occupied_status: {
     table_1: 1,
     table_2: 0,
     table_3: 1,
     table_4: 1,
     table_5: 0,
     table_6: 1,
     table_7: 0,
     table_8: 1,
     table_9: 0,
     table_10: 1
   }
 },
 {
   cafe_id: 6,
   cafe_name: "메가커피 강남점",
   lat: 37.498562,
   lng: 127.026198,
   tables_occupied_status: {
     table_1: 0,
     table_2: 0,
     table_3: 0,
     table_4: 0,
     table_5: 1,
     table_6: 0,
     table_7: 0,
     table_8: 0,
     table_9: 0,
     table_10: 0
   }
 },
 {
   cafe_id: 7,
   cafe_name: "할리스커피 강남역점",
   lat: 37.496748,
   lng: 127.028569,
   tables_occupied_status: {
     table_1: 1,
     table_2: 0,
     table_3: 1,
     table_4: 0,
     table_5: 1,
     table_6: 0,
     table_7: 1,
     table_8: 0,
     table_9: 1,
     table_10: 0
   }
 },
 {
   cafe_id: 8,
   cafe_name: "이디야커피 강남역점",
   lat: 37.497532,
   lng: 127.028127,
   tables_occupied_status: {
     table_1: 0,
     table_2: 1,
     table_3: 0,
     table_4: 0,
     table_5: 0,
     table_6: 1,
     table_7: 0,
     table_8: 0,
     table_9: 0,
     table_10: 1
   }
 },
 {
   cafe_id: 9,
   cafe_name: "탐앤탐스 강남",
   lat: 37.498234,
   lng: 127.027891,
   tables_occupied_status: {
     table_1: 0,
     table_2: 0,
     table_3: 1,
     table_4: 0,
     table_5: 1,
     table_6: 0,
     table_7: 0,
     table_8: 1,
     table_9: 0,
     table_10: 0
   }
 },
 {
   cafe_id: 10,
   cafe_name: "컴포즈커피 강남점",
   lat: 37.498921,
   lng: 127.026732,
   tables_occupied_status: {
     table_1: 1,
     table_2: 1,
     table_3: 0,
     table_4: 1,
     table_5: 0,
     table_6: 1,
     table_7: 1,
     table_8: 0,
     table_9: 1,
     table_10: 0
   }
 }
];

// 카페 상세 정보 더미 데이터
export const mockCafeDetails: Record<number, CafeDetail> = {
 1: {
   cafe_id: 1,
   cafe_name: "스타벅스 강남점",
   lat: 37.498095,
   lng: 127.027610,
   address: "서울 강남구 강남대로 390",
   contact: "02-1234-5678",
   operatingHours: "매일 07:00 - 23:00",
   tables_occupied_status: mockCafes[0].tables_occupied_status
 },
 2: {
   cafe_id: 2,
   cafe_name: "투썸플레이스 강남역점",
   lat: 37.497124,
   lng: 127.028364,
   address: "서울 강남구 강남대로 398",
   contact: "02-2345-6789",
   operatingHours: "매일 08:00 - 22:00",
   tables_occupied_status: mockCafes[1].tables_occupied_status
 },
 3: {
   cafe_id: 3,
   cafe_name: "블루보틀 강남점",
   lat: 37.499447,
   lng: 127.029054,
   address: "서울 강남구 테헤란로 427",
   contact: "02-3456-7890",
   operatingHours: "매일 09:00 - 21:00",
   tables_occupied_status: mockCafes[2].tables_occupied_status
 },
 4: {
   cafe_id: 4,
   cafe_name: "폴 바셋 강남",
   lat: 37.496185,
   lng: 127.026878,
   address: "서울 강남구 강남대로 380",
   contact: "02-4567-8901",
   operatingHours: "매일 08:00 - 22:00",
   tables_occupied_status: mockCafes[3].tables_occupied_status
 },
 5: {
   cafe_id: 5,
   cafe_name: "커피빈 강남역점",
   lat: 37.497756,
   lng: 127.029480,
   address: "서울 강남구 테헤란로 151",
   contact: "02-5678-9012",
   operatingHours: "매일 07:30 - 22:30",
   tables_occupied_status: mockCafes[4].tables_occupied_status
 },
 6: {
   cafe_id: 6,
   cafe_name: "메가커피 강남점",
   lat: 37.498562,
   lng: 127.026198,
   address: "서울 강남구 강남대로 365",
   contact: "02-6789-0123",
   operatingHours: "매일 24시간",
   tables_occupied_status: mockCafes[5].tables_occupied_status
 },
 7: {
   cafe_id: 7,
   cafe_name: "할리스커피 강남역점",
   lat: 37.496748,
   lng: 127.028569,
   address: "서울 강남구 강남대로 396",
   contact: "02-7890-1234",
   operatingHours: "매일 08:00 - 23:00",
   tables_occupied_status: mockCafes[6].tables_occupied_status
 },
 8: {
   cafe_id: 8,
   cafe_name: "이디야커피 강남역점",
   lat: 37.497532,
   lng: 127.028127,
   address: "서울 강남구 강남대로 392",
   contact: "02-8901-2345",
   operatingHours: "매일 07:00 - 22:00",
   tables_occupied_status: mockCafes[7].tables_occupied_status
 },
 9: {
   cafe_id: 9,
   cafe_name: "탐앤탐스 강남",
   lat: 37.498234,
   lng: 127.027891,
   address: "서울 강남구 강남대로 385",
   contact: "02-9012-3456",
   operatingHours: "매일 07:00 - 23:00",
   tables_occupied_status: mockCafes[8].tables_occupied_status
 },
 10: {
   cafe_id: 10,
   cafe_name: "컴포즈커피 강남점",
   lat: 37.498921,
   lng: 127.026732,
   address: "서울 강남구 강남대로 375",
   contact: "02-0123-4567",
   operatingHours: "매일 08:00 - 22:00",
   tables_occupied_status: mockCafes[9].tables_occupied_status
 }
};