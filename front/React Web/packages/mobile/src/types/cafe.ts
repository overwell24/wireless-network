// src/types/cafe.ts
export interface Cafe {
    cafe_id: number;
    cafe_name: string;
    lat: number;
    lng: number;
    tables_occupied_status?: TableStatus;
  }
  
  export interface TableStatus {
    [key: string]: number;  // "table_1": 0 또는 1
  }
  
  export interface CafeDetail extends Cafe {
    address?: string;
    contact?: string;
    operatingHours?: string;
  }