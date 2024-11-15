declare namespace kakao.maps {
    export class LatLng {
      constructor(lat: number, lng: number);
      getLat(): number;
      getLng(): number;
    }
  
    export namespace services {
      export class Places {
        categorySearch(
          code: string,
          callback: (
            result: any[],
            status: kakao.maps.services.Status,
            pagination: kakao.maps.services.Pagination
          ) => void,
          options?: {
            location: kakao.maps.LatLng;
            radius: number;
            sort: kakao.maps.services.SortBy;
          }
        ): void;
      }
  
      export enum Status {
        OK = "OK",
        ZERO_RESULT = "ZERO_RESULT",
        ERROR = "ERROR"
      }
  
      export enum SortBy {
        DISTANCE = "DISTANCE"
      }
  
      export interface Pagination {
        current: number;
        first: number;
        last: number;
        hasNext: boolean;
        hasPrev: boolean;
      }
    }
  }
  
  declare global {
    interface Window {
      kakao: typeof kakao;
    }
  }